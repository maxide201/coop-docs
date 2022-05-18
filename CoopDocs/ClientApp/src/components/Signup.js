import React, { Component } from 'react';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import Auth from './Auth'


export class Signup extends Component {

    constructor(props) {
        super(props);
        this.state = { login: "", password: "" };
    }

  render() {
    return (
      <div>
        <h1>Регистрация</h1>
            <Form>
                <FormGroup className="mb-3" controlId="formBasicEmail">
                    <Label>Логин</Label>
                    <Input type="text" onChange={e => this.setState({ login: e.target.value })}/>
                </FormGroup>
                <FormGroup className="mb-3" controlId="formBasicPassword">
                    <Label>Пароль</Label>
                    <Input type="text" onChange={e => this.setState({ password: e.target.value })}/>
                </FormGroup>
                <button variant="primary" onClick={() => Auth.SignUp(this.state.login, this.state.password)}>
                    Подтвердить
                </button>
            </Form>
      </div>
    );
  }
}
