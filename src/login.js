import React from "react";
import './login.css';
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import './Home.css'



const Login = ({  }) => {
  
    const history = useNavigate()
    async function login() {
        history('/coin')
        if (typeof window.ethereum !== 'undefined') {
            console.log('有安裝小狐狸');
        }
        else {
            console.log('請安裝小狐狸')
        }
        async function getAccount() {
            const ethereum = window.ethereum
            console.log(ethereum);
            var accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            var wallet_address = accounts[0];
            document.getElementById('wallet').value = wallet_address;
        }
        getAccount()
    }
    return (
        <div>
            <div className="singC">
                <h1 className="h1">登入錢包</h1>
                <p></p>
                <input style={{ position: 'absolute', top: '3%', right: '1%', width: '5%', zIndex: 10 }}  type={'image'} src='./image/demohistory.png'></input>
                <input style={{ position: 'fixed', top: '33%', left: '37%', width: '400px', zIndex: 999, }} onClick={login} type={'image'} src='./image/demologin.gif'></input>
            </div>
        </div>

    )
}

export default Login;