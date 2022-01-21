import React from 'react';
import jwt_decode from 'jwt-decode';

class Login extends React.Component {
    history = null;
    constructor(props) {
        super(props);
        this.state = {
            username: 'name4',
            email: 'user4@email.com',
            password: 'password4',
        };
    }

    submit = () => {
        const formData = new FormData();
        if (this.props.method === 'email') {
            console.log('hidden username = ' + this.state.username);
            console.log('email = ' + this.state.email);
            console.log('password = ' + this.state.password);
            formData.append('email', this.state.email);
            formData.append('password', this.state.password);
            fetch('http://localhost:1323/emaillogin', { method: 'POST', body: formData })
                .then((response) => response.text())
                .then((data) => {
                    console.log(data);
                    return data;
                })
                .then((data) => {
                    localStorage.setItem('userInfo', data);
                    const userInfo = JSON.parse(data);
                    console.log('localStorage: userInfo.token = ' + userInfo.token);
                    this.setTimer(userInfo.token);
                    this.routeChangeToAdmin();
                })
                .catch((err) => {
                    console.log('refresh token error');
                    console.log(err);
                });
        }else{
            console.log('username = ' + this.state.username);
            console.log('hidden email = ' + this.state.email);
            console.log('password = ' + this.state.password);
            formData.append('username', this.state.username);
            formData.append('password', this.state.password);
            fetch('http://localhost:1323/login', { method: 'POST', body: formData })
                .then((response) => response.text())
                .then((data) => {
                    console.log(data);
                    return data;
                })
                .then((data) => {
                    localStorage.setItem('userInfo', data);
                    const userInfo = JSON.parse(data);
                    console.log('localStorage: userInfo.token = ' + userInfo.token);
                    this.setTimer(userInfo.token);
                    this.routeChangeToAdmin();
                })
                .catch((err) => {
                    console.log('refresh token error');
                    console.log(err);
                });
            }
    };

    setTimer = (token) => {
        const decoded = jwt_decode(token);
        const exp = new Date(decoded.exp * 1000);
        const currentTime = new Date();
        const timerMS = exp - currentTime - 10000;
        setTimeout(() => this.refreshToken(token), timerMS);
        console.log('set timer: ' + timerMS);
    };

    refreshToken = (token) => {
        console.log('refresh token here');
        fetch('http://localhost:1323/admin/refreshtoken', {
            method: 'GET',
            headers: { Authorization: 'Bearer ' + token },
        })
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error('non 200');
                }
                return response;
            })
            .then((response) => response.text())
            .then((data) => {
                console.log('new token: ' + data);
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                userInfo.token = data;
                const userInfoString = JSON.stringify(userInfo);
                localStorage.setItem('userInfo', userInfoString);
                console.log(userInfoString);
                this.setTimer(data);
            });
    };

    routeChangeToAdmin = () => {
        console.log('route change to admin page');
        const path = '/ui/admin';
        this.props.history.push(path);
    };

    render() {
        return (
            <div>
                <div>
                    <input
                        type='text'
                        name='username'
                        value={this.state.username}
                        placeholder='username'
                        style={this.props.method === 'username' ? {} : { display: 'none' }}
                        onChange={(e) => this.setState({ username: e.target.value })}
                    ></input>
                    <input
                        type='text'
                        name='email'
                        value={this.state.email}
                        placeholder='email'
                        style={this.props.method === 'email' ? {} : { display: 'none' }}
                        onChange={(e) => this.setState({ email: e.target.value })}
                    ></input>
                    <input
                        type='text'
                        name='password'
                        value={this.state.password}
                        placeholder='Password'
                        onChange={(e) => this.setState({ password: e.target.value })}
                    ></input>
                </div>
                <button onClick={this.submit}>Login</button>
            </div>
        );
    }
}

export default Login;
