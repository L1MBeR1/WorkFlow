import React, { useState} from 'react';
import '../../css/componentPanel.css';

import { ReactComponent as Info } from '../../images/ComponentPanel/info.svg';

const CompDescription = (props) => {

    const message = props.content;
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className='info_svg' onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
             >
            <Info className='svg'></Info>
            {isVisible && (
                <div
                    className="hovered-message"
                >
                    {message}
                </div>
            )}
        </div>
    );
};

export default CompDescription;
