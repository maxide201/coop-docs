import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class SharedDocuments extends Component {

    constructor(props) {
        super(props);
        this.state = { loading: true, documents: [] };
    }

    componentDidMount() {
        this.GetData();
    }

    async GetData() {
        const response = await fetch('api/document/shared');
        const data = await response.json();
        this.setState({ documents: data, loading: false });
    }

    static renderDocuments(documents) {
        return (
            documents.map(doc =>
                <div>
                    <Link to={"/editor/" + doc.id} style={{ textDecoration: "none", color: "black" }}>
                        <h3>{doc.name}</h3>
                        {doc.permission == 2 ? 
                            "редактирование" : "чтение"}
                    </Link>
                    <hr/>
                </div>
            )
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : SharedDocuments.renderDocuments(this.state.documents);

        return (
            <div>
                {contents}
            </div>
        );
    }
}
