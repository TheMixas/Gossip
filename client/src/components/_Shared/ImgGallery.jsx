import {useState} from "react";
import './SCSS/img-gallery.scss'

export default function ImgGallery({images64=[]}) {

    const [currentImg, setCurrentImg] = useState(0);
    const length = images64.length;

    const handleNext = () => {
        setCurrentImg(currentImg === length - 1 ? 0 : currentImg + 1);
    }
    const handlePrev = () => {
        setCurrentImg(currentImg === 0 ? length - 1 : currentImg - 1);
    }

    if(!Array.isArray(images64) || images64.length <= 0){
        return null;
    }

    return(
        <div className="img-gallery">

            {/*<div className="next" onClick={handleNext}/>*/}
            {images64.map((img64, index) => {
                return(
                    <div key={index} className={index === currentImg ? "img-container--active" : 'img-container' }>
                        {index === currentImg &&(
                            <img src={`data:image/jpeg;base64,${img64}`} alt="" className="image"></img>)
                        }
                    </div>)
            })}
            {
                images64.length > 1 && (<>
                    <div className="gallery-nav gallery-nav--prev" onClick={handlePrev}/>
                    <div className="gallery-nav gallery-nav--next" onClick={handleNext}/></>)
            }


        </div>
    )
}