import '../scss/buttons.scss';
function Button({text,type}) {
    return(
        <button className={`button__${type}`}><p>{text}</p></button>
    )
}
export default Button;