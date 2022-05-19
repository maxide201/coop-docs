import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

export class MyDocuments extends Component {

    constructor(props) {
        super(props);
        this.state = { loading: true, documents: [] };
    }

    componentDidMount() {
        this.GetData();
    }

    async GetData() {
        const response = await fetch('api/document/my');
        const data = await response.json();
        this.setState({ documents: data, loading: false });
    }

    static renderDocuments(documents) {

        return (
            documents.map(doc =>
                <div>

                    <Link to={"/editor/" + doc.id} style={{ textDecoration: "none", color: "black" }}>
                        <h3>{doc.name}</h3>
                    </Link>
                    <hr/>
                </div>
            )
        )
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : MyDocuments.renderDocuments(this.state.documents);

        return (
            <div>
                <Button outline color="secondary" type="button" style={{ float: "left" }}>
                    Создать документ
                </Button>
                <br/>
                <br />  
                {contents}
            </div>
        );
    }
}
