import React, { useState, useEffect, useRef } from 'react';
import './ccc.css';
import { ReactComponent as ComArrow } from './arrow.svg';

const IntaractiveSection = (props) => {
    const [isVisible, setIsVisible] = useState(props.visible);

    const functionsRef = useRef(null);
    const [contentHeight, setContentHeight] = useState('auto');

    useEffect(() => {
        if (functionsRef.current) {
            setContentHeight(functionsRef.current.scrollHeight);
        }
    }, [isVisible,props.children]);

    const handleComponentClick = () => {
        setIsVisible(!isVisible);
        console.log(contentHeight)
    };
    
    return (
        <div className="Section">
            
            <div className="Trigger" onClick={handleComponentClick}>
            <div className='Arrow'>
                        <ComArrow className='svg' style={{ transform: isVisible ? 'scaleY(-1)' : 'scaleY(1)' }}></ComArrow>
                </div>
                <p>{props.sectionName}</p>

            </div>
            <div
                className='section-content'
                style={{ height: isVisible ? contentHeight : 0 }}
            >
                <div ref={functionsRef}>
                {props.children}
                </div>
            </div>
        </div>
    );
};

export default IntaractiveSection;