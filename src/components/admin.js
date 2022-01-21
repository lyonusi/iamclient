import React from 'react';

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            userList: [],
            confirm: '',
            deleteUserName:'',
        };
    }

    componentDidMount = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        this.setState({ user: userInfo.userName });
    };

    listUser = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo.token;
        fetch('http://localhost:1323/admin/listuser', {
            method: 'GET',
            headers: { Authorization: 'Bearer ' + token },
        })
            .then((response) => response.json())
            .then((data) => {
                // console.log(data)
                this.setState({ userList: data });
            });
    };

    routeChangeToEdit = (userInfo) => {
        console.log('route change to edit');
        const userInfoString = JSON.stringify(userInfo);
        localStorage.setItem('editUserInfo', userInfoString);
        const path = '/admin/update';
        this.props.history.push(path);
    };

    routeChangeToCreate = () => {
        console.log('route change to create user');
        const path = '/admin/create';
        this.props.history.push(path);
    };

    confirmDeleteUser = (userInfo) => {
        console.log('confirm delete user');
        this.setState({ confirm: 'delete', deleteUserName:userInfo.userName});
        const deleteUserInfoString = JSON.stringify(userInfo);
        localStorage.setItem('deleteUserInfo', deleteUserInfoString);
    };

    deleteUser = (bool) => {
        if (bool) {
            console.log('delete user');
            const formData = new FormData();
            formData.append('id', JSON.parse(localStorage.getItem('deleteUserInfo')).userID);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const token = userInfo.token;
            fetch('http://localhost:1323/admin/delete', {
                method: 'POST',
                headers: { Authorization: 'Bearer ' + token },
                body: formData,
            })
                .then((response) => {
                    if (response.status !== 200) {
                        throw new Error('delete user error');
                    } else {
                        if (this.state.user.length !== 0){
                            this.listUser()
                        }
                        this.setState({ confirm: '' ,deleteUserName:''});
                        localStorage.removeItem('deleteUserInfo') 
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            console.log('cancel delete user');
            this.setState({ confirm: '',deleteUserName:'' });
            localStorage.removeItem('deleteUserInfo') 
        }
    };

    render() {
        return (
            <div>
                <div>
                    <h1>Hello, {this.state.user}!</h1>
                    <p>This is a default admin user page.</p>
                </div>
                <button onClick={this.listUser}>List All Users</button>
                <button onClick={() => this.routeChangeToCreate({})}>Create User</button>
                <div style={this.state.userList.length > 0 ? {} : { display: 'none' }}>
                    <table>
                        <thead></thead>
                        <tbody>
                            <tr>
                                <td>User ID</td>
                                <td>User Name</td>
                                <td>User Email</td>
                                <td></td>
                            </tr>
                            {this.state.userList.map((value) => {
                                return (
                                    <tr key={value.userID}>
                                        <td>{value.userID}</td>
                                        <td>{value.userName}</td>
                                        <td>{value.userEmail}</td>
                                        <td>
                                            <button
                                                onClick={() =>
                                                    this.routeChangeToEdit({
                                                        userID: value.userID,
                                                        userName: value.userName,
                                                        userEmail: value.userEmail,
                                                    })
                                                }
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    this.confirmDeleteUser({
                                                        userID: value.userID,
                                                        userName: value.userName,
                                                    })
                                                }
                                            >
                                                Delete
                                            </button>
                                            {/* <button
                                                onClick={() =>
                                                    this.routeChangeToScope({
                                                        userID: value.userID,
                                                        userName: value.userName,
                                                        userEmail: value.userEmail,
                                                    })
                                                }
                                            ></button> */}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div style={this.state.confirm === 'delete' ? {} : { display: 'none' }}>
                        <p>Do you wish to delete {this.state.deleteUserName}?</p>
                        <button onClick={() => this.deleteUser(true)}>Yes, Delete</button>
                        <button onClick={() => this.deleteUser(false)}>No</button>
                    </div>
            </div>
        );
    }
}

export default Admin;
