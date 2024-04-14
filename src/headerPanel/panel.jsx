import React, { useState, useEffect, useRef } from 'react';

import TestButton from './testButton';
import MenuButton from './backToMenuButton';
import { ReactComponent as Arrow } from './back-arrow.svg';

import './HeaderPanel.css'

const HeaderPanel=()=>{
    return(
        <header className='main-container'>
            <div className='item'>
                <MenuButton>
                    <Arrow className='svg-back'/>
                </MenuButton>
                <div className='title'>
                    Cоздания потока работ на основе веб-сервисов
                </div>
                
            </div>
            <div className='item'>
                <TestButton>
                    Протестировать
                </TestButton>
            </div>
        </header>
    );

};
export default HeaderPanel;