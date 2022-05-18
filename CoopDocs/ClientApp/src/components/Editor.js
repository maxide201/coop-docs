/* eslint-disable react-hooks/exhaustive-deps */
import { default as React, useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import { HubConnectionBuilder } from "@microsoft/signalr"

const EDITTOR_HOLDER_ID = 'editorjs';

let editor = null;

const connection = new HubConnectionBuilder()
    .withUrl('hubs/doc')
    .withAutomaticReconnect()
    .build();

connection.start()
    .then(result => {
        console.log('Connected!');

        connection.on('document', message => {
            let document = message;
            editor.render(JSON.parse(document.content));
        });

        connection.on('action', message => {
            let action = JSON.parse(message);
            editor.render(JSON.parse(action.content));
        });

    })
    .catch(e => console.log('Connection failed: ', e));

function SynchronizeChangesWithServer(content) {

    let action = {
        xMouse: 1,
        yMouse: 1,
        cursor: 1,
        content: JSON.stringify(content),
        isContentChanged: true
    };

    connection.invoke("SendMyAction", JSON.stringify(action));
}

const Editor = (props) => {
    const ejInstance = useRef();

    // This will run only once
    useEffect(() => {
        if (!ejInstance.current) {
            initEditor();
        }
        return () => {
            ejInstance.current.destroy();
            ejInstance.current = null;
        }
    }, []);

    const initEditor = () => {
            editor = new EditorJS({
            holder: EDITTOR_HOLDER_ID,
            logLevel: "ERROR",
            onReady: () => {
                ejInstance.current = editor;
                var url = window.location.pathname;
                var id = url.substring(url.lastIndexOf('/') + 1);
                connection.invoke("OpenDocument", id);
            },
            onChange: async () => {
                let content = await editor.saver.save();
                SynchronizeChangesWithServer(content);
            },

            autofocus: true,
            tools: {
                header: Header,
            },
        });
    };

    return (
        <React.Fragment>
            <div id={EDITTOR_HOLDER_ID}> </div>
        </React.Fragment>
    );
}

export default Editor;

