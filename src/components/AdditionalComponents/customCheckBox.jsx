import React,{useState} from "react";

const CheckBox =()=>{
    const [checked,setChecked] = useState(false);
    const setState=()=>{
        setChecked(!checked)
    };
    return(
        <div className="custom-CheckBox" onClick={setState}>
            <div className="custom-CheckBox-content">
            <div className='custom-CheckBox-on' style={{ transform: `translateX(${checked ? '-50%' : '5%'})` }}>
                <div className="custom-CheckBox-circle"></div>
                </div>
            </div>

        </div>
    );
}
export default CheckBox;