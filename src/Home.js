import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'



const Home = ({  }) => {

    const history = useNavigate()
    return (
        <div >
            <div>
                <img className='imm' src="./image/demo.gif" alt="Ad" />
            </div>
            <input style={{ position: 'fixed', top: '1%', left: '32%', width: '160px', zIndex: 1 }} type={'image'} src='./image/demologo.png'></input>
            <input style={{ position: 'fixed', top: '-3%', left: '40%', width: '500px', zIndex: 1 }} type={'image'} src='./image/Gamename.png'></input>
            <input style={{ position: 'fixed', top: '65%', left: '36%', width: '400px', zIndex: 999 }} onClick={() => history('/coin')} type={'image'} src='./image/demostart.gif'></input>

        </div>
    )
}

export default Home