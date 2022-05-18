import React from "react";
import Draft from "draft-js";
import { HubConnectionBuilder } from "@microsoft/signalr"
import "./rich.css";

const { Editor, EditorState, RichUtils, getDefaultKeyBinding, convertToRaw, ContentBlock} = Draft;

export class EditorPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { editorState: EditorState.createEmpty(), connection: null };
        this.focus = () => this.refs.editor.focus();
        this.onChange = editorState => {
            this.SynchronizeChangesWithServer(this.state.editorState, editorState);
            this.setState({ editorState })
        };
        this.handleKeyCommand = this._handleKeyCommand.bind(this);
        this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
        this.toggleBlockType = this._toggleBlockType.bind(this);
        this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
    }

    componentDidMount() {
        const newConnection = new HubConnectionBuilder()
            .withUrl('hubs/doc')
            .withAutomaticReconnect()
            .build();

       this.setState({ connection: newConnection })

        newConnection.start()
            .then(result => {
                console.log('Connected!');

                newConnection.on('document', message => {
                    this.setState({ documentData: message, data: true});
                });

                newConnection.on('action', message => {
                    let action = JSON.parse(message);
                    this.RenderAction(action);
                });

                newConnection.invoke("OpenDocument", this.state.document_id)
            })
            .catch(e => console.log('Connection failed: ', e));
    }

    RenderAction(action) {
        if (action.isContentChanged) {
            if (action.type === "change") {
                console.log(action);
                const contentState = this.state.editorState.getCurrentContent();
                const data = action.content[0];
                let newBlock = new ContentBlock();
                newBlock.key = data.key;
                newBlock.type = data.type;
                newBlock.text = data.text;
                newBlock.inlineStyleRanges = data.inlineStyleRanges
    
                const newBlockMap = contentState.getBlockMap().set(action.content[0].key, newBlock);

                console.log(this.state.editorState);

                let a = this.state.editorState;
                let b = contentState
                    .createFromBlockArray(newBlockMap.toArray());
                a.push(
                    a,
                    b
                );
                console.log("тут");
                console.log(this.state.editorState);

                this.onChange(this.state.editorState);
            }
        }
    }

    SynchronizeChangesWithServer(oldState, newState) {
        let oldBlocks = convertToRaw(oldState.getCurrentContent()).blocks;
        let newBlocks = convertToRaw(newState.getCurrentContent()).blocks;
        let blocksToSend = [];
        let type = "";

        if (newBlocks.length == oldBlocks.length) {
            blocksToSend = newBlocks.filter(x => {
                let ob = oldBlocks.filter(y => y.key === x.key)[0];
                return ob.text != x.text || ob.type != x.type || ob.depth != x.depth || ob.inlineStyleRanges.length != x.inlineStyleRanges.length
            })
            type = "change";
        }
        else if (newBlocks.length < oldBlocks.length) {
            blocksToSend = oldBlocks.filter(x => newBlocks.filter(y => y.key === x.key).length === 0);
            type = "delete";
        }
        else {
            blocksToSend = newBlocks.filter(x => {
                let oldFiltered = oldBlocks.filter(y => y.key === x.key);
                if (oldFiltered.length === 0)
                    return true;
                else {
                    let ob = oldFiltered[0];
                    return ob.text != x.text || ob.type != x.type || ob.depth != x.depth || ob.inlineStyleRanges.length != x.inlineStyleRanges.length
                }
            })
            type = "insert";
        }

        if (blocksToSend.length !== 0) {
            let action = {
                xMouse: 1,
                yMouse: 1,
                cursor: 1,
                content: blocksToSend,
                isContentChanged: true,
                type: type
            };

            this.state.connection.invoke("SendMyAction", JSON.stringify(action));
        }

    }

    _handleKeyCommand(command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }
    _mapKeyToEditorCommand(e) {
        if (e.keyCode === 9 /* TAB */) {
            const newEditorState = RichUtils.onTab(
                e,
                this.state.editorState,
                4 /* maxDepth */
            );
            if (newEditorState !== this.state.editorState) {
                this.onChange(newEditorState);
            }
            return;
        }
        return getDefaultKeyBinding(e);
    }
    _toggleBlockType(blockType) {
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
    }
    _toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
        );
    }
    render() {
        const { editorState } = this.state;
        // If the user changes block type before entering any text, we can
        // either style the placeholder or hide it. Let's just hide it now.
        let className = "RichEditor-editor";
        var contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            if (
                contentState
                    .getBlockMap()
                    .first()
                    .getType() !== "unstyled"
            ) {
                className += " RichEditor-hidePlaceholder";
            }
        }
        return (
            <div className="RichEditor-root">
                <BlockStyleControls
                    editorState={editorState}
                    onToggle={this.toggleBlockType}
                />
                <InlineStyleControls
                    editorState={editorState}
                    onToggle={this.toggleInlineStyle}
                />
                <div className={className} onClick={this.focus}>
                    <Editor
                        blockStyleFn={getBlockStyle}
                        customStyleMap={styleMap}
                        editorState={editorState}
                        handleKeyCommand={this.handleKeyCommand}
                        keyBindingFn={this.mapKeyToEditorCommand}
                        onChange={this.onChange}
                        placeholder="Начните писать..."
                        ref="editor"
                        spellCheck={true}
                    />
                </div>
            </div>
        );
    }
}

// Custom overrides for "code" style.
const styleMap = {
    CODE: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2
    }
};
function getBlockStyle(block) {
    switch (block.getType()) {
        case "blockquote":
            return "RichEditor-blockquote";
        default:
            return null;
    }
}
class StyleButton extends React.Component {
    constructor() {
        super();
        this.onToggle = e => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }
    render() {
        let className = "RichEditor-styleButton";
        if (this.props.active) {
            className += " RichEditor-activeButton";
        }
        return (
            <span className={className} onMouseDown={this.onToggle}>
                {this.props.label}
            </span>
        );
    }
}
const BLOCK_TYPES = [
    { label: "H1", style: "header-one" },
    { label: "H2", style: "header-two" },
    { label: "H3", style: "header-three" },
    { label: "H4", style: "header-four" },
    { label: "H5", style: "header-five" },
    { label: "H6", style: "header-six" },
    { label: "Blockquote", style: "blockquote" },
    { label: "UL", style: "unordered-list-item" },
    { label: "OL", style: "ordered-list-item" },
    { label: "Code Block", style: "code-block" }
];
const BlockStyleControls = props => {
    const { editorState } = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();
    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map(type => (
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            ))}
        </div>
    );
};
var INLINE_STYLES = [
    { label: "Bold", style: "BOLD" },
    { label: "Italic", style: "ITALIC" },
    { label: "Underline", style: "UNDERLINE" },
    { label: "Monospace", style: "CODE" }
];
const InlineStyleControls = props => {
    const currentStyle = props.editorState.getCurrentInlineStyle();

    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map(type => (
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            ))}
        </div>
    );
};

//let a = convertToRaw(editorState.getCurrentContent())
//let b = { blocks: a.blocks, entityMap: {} }

//export class Editor extends Component {
//    constructor(props) {
//        super(props);
//        const { id } = this.props.match.params;
//        this.state = { connection: null, documentData: null, document_id: id, data: false };
//        this.textAreaChanged = this.textAreaChanged.bind(this);
//    }

//    componentDidMount() {
//        const newConnection = new HubConnectionBuilder()
//            .withUrl('hubs/doc')
//            .withAutomaticReconnect()
//            .build();

//        this.setState({ connection: newConnection })

//        newConnection.start()
//            .then(result => {
//                console.log('Connected!');

//                newConnection.on('document', message => {
//                    this.setState({ documentData: message, data: true});
//                    console.log(this.state.documentData);
//                });

//                newConnection.on('action', message => {
//                    console.log(message);
//                });

//                newConnection.invoke("OpenDocument", this.state.document_id)
//            })
//            .catch(e => console.log('Connection failed: ', e));
//    }

//    textAreaChanged(e) {
//        this.state.documentData.content = e.target.value;
//        this.setState({ documentData: this.state.documentData });

//        console.log(e)
//        let action = {
//            xMouse: 1,
//            yMouse: 1,
//            cursor: e.target.selectionEnd,
//            content: e.target.value,
//            isContentChanged: true
//        };
//    }

//    render() {
//        let txtArea = !this.state.data
//            ? <div>Loading...</div>
//            : <textarea id="txtArea" value={this.state.documentData.content} onChange={this.textAreaChanged} />

//        return (
//            <div>
//                <h1>Редактор</h1>
//                {txtArea}
//            </div>
//        );
//    }
//}

