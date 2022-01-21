import React from 'react';
class EditUser extends React.Component {
    constructor(props) {
        super(props);
        this.pwdRef = React.createRef();
        this.state = {
            user: {
                userName: '',
                userEmail: '',
                userID: '',
                userPassword: '',
            },
            checkForm: '',
            diplayReturnButton: false,
            userMessage: '',
        };
    }

    componentDidMount = () => {
        if (this.props.action === 'edit') {
            const userInfo = JSON.parse(localStorage.getItem('editUserInfo'));
            this.setState({ user: userInfo });
        }
    };

    routeChangeToAdmin = () => {
        console.log('route change to admin page');
        let path = '/ui/admin';
        this.props.history.push(path);
        this.setState({ diplayReturnButton: false, checkForm: '', userMessage: '' });
    };

    editUser = () => {
        if(!this.state.user.userName || !this.state.user.userEmail){
            this.setState({ diplayReturnButton: false, checkForm: 'Invalid input', userMessage: '' });
            return;
        }
        const adminUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = adminUserInfo.token;
        const formData = new FormData();

        if (this.props.action === 'edit') {
            const userInfo = JSON.parse(localStorage.getItem('editUserInfo'));
            if (
                this.state.user.userName === userInfo.userName &&
                this.state.user.userEmail === userInfo.userEmail
            ) {
                this.setState({ checkForm: 'No change was made. Try again.' });
                return;
            }

            formData.append('name', this.state.user.userName);
            formData.append('email', this.state.user.userEmail);
            formData.append('userID', this.state.user.userID);

            fetch('http://localhost:1323/admin/update?field=user', {
                method: 'POST',
                headers: { Authorization: 'Bearer ' + token },
                body: formData,
            })
                .then((response) => {
                    if (response.status !== 200) {
                        throw new Error('edit user error');
                    } else {
                        this.setState({
                            checkForm: '',
                            diplayReturnButton: true,
                            userMessage: 'Success!',
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            if (this.pwdRef.current.value !== this.state.user.userPassword) {
                this.setState({ checkForm: 'Password does not match. Try again.' });
                return;
            }

            formData.append('name', this.state.user.userName);
            formData.append('email', this.state.user.userEmail);
            formData.append('password', this.state.user.userPassword);

            fetch('http://localhost:1323/admin/createuser', {
                method: 'POST',
                headers: { Authorization: 'Bearer ' + token },
                body: formData,
            })
                .then((response) => {
                    if (response.status !== 200) {
                        throw new Error('create user error');
                    } else {
                        this.setState({
                            checkForm: '',
                            diplayReturnButton: true,
                            userMessage: 'Success!',
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    render() {
        return (
            <div>
                <h1>Edit user here</h1>
                <div>
                    <input
                        type='text'
                        value={this.state.user.userName}
                        placeholder='username'
                        onChange={(e) =>
                            this.setState({
                                user: { ...this.state.user, userName: e.target.value },
                            })
                        }
                        style={this.state.diplayReturnButton === false ? {} : { display: 'none' }}
                    ></input>
                    <input
                        type='text'
                        value={this.state.user.userEmail}
                        placeholder='email'
                        onChange={(e) =>
                            this.setState({
                                user: { ...this.state.user, userEmail: e.target.value },
                            })
                        }
                        style={this.state.diplayReturnButton === false ? {} : { display: 'none' }}
                    ></input>
                    <br />
                    <input
                        style={
                            this.props.action === 'edit' || this.state.diplayReturnButton === true
                                ? { display: 'none' }
                                : {}
                        }
                        placeholder='password'
                        type='password'
                        ref={this.pwdRef}
                    ></input>
                    <input
                        style={
                            this.props.action === 'edit' || this.state.diplayReturnButton === true
                                ? { display: 'none' }
                                : {}
                        }
                        placeholder='retype password'
                        type='password'
                        onChange={(e) =>
                            this.setState({
                                user: { ...this.state.user, userPassword: e.target.value },
                            })
                        }
                    ></input>
                    <br/>
                    {this.state.checkForm}
                    {this.state.userMessage}
                    {this.state.displayReturnButton}<br/>
                </div>
                <button
                    style={this.state.diplayReturnButton === false ? {} : { display: 'none' }}
                    onClick={this.editUser}
                >
                    Confirm
                </button>
                <button
                    style={this.state.diplayReturnButton === true ? {} : { display: 'none' }}
                    onClick={this.routeChangeToAdmin}
                >
                    Return
                </button>
            </div>
        );
    }
}

export default EditUser;
