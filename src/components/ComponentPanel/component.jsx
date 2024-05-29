import React, { useState, useEffect, useRef } from 'react';
import '../../css/componentPanel.css';
import Info from './componentDescription';
import { ReactComponent as ComArrow } from '../../images/ComponentPanel/component-arrow.svg';

const Component = (props) => {
    const [isVisible, setIsVisible] = useState(false);
    const functionsRef = useRef(null);
    const [contentHeight, setContentHeight] = useState('auto');

    useEffect(() => {
        if (functionsRef.current) {
            setContentHeight(functionsRef.current.scrollHeight);
        }
    });

    const handleComponentClick = () => {
        setIsVisible(!isVisible);
        // console.log(contentHeight)
    };
    
    return (
        <div className="componentAndFuncs">
            <div className="component" onClick={handleComponentClick}>
                <p>{props.compName}</p>
                <div className='icons'>
                    {props.compDescripton &&(
                        <Info content={props.compDescripton}/>
                    )}
                    <div className='compArrow'>
                        <ComArrow className='svg' style={{ transform: isVisible ? 'scaleY(-1)' : 'scaleY(1)' }}></ComArrow>
                    </div>
                </div>
            </div>
            <div
                className='functions'
                style={{ height: isVisible ? contentHeight : 0 }}
            >
                <div ref={functionsRef}>
                {props.children}
                </div>
            </div>
        </div>
    );
};

export default Component;
