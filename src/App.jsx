import { useRef, useState } from "react";
import "./App.css";

function App() {
  const [images, setImages] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const inputRef = useRef(null);

  const handleImageInputClick = () => {
    inputRef.current.click();
  };

  function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImages((prevImages) => [...prevImages, { url: imageUrl }]);
    }
  }

  //image select and deselect 

  const handleImageClick = (index) => {
    if (selectedIndices.includes(index)) {
      //deselect
      setSelectedIndices(selectedIndices.filter((i) => i !== index));
    } else {
      //select
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  // remove the image that is  slected image
  const handleDeleteSelectedImages = () => {
    const updatedImages = images.filter(
      //_ means that values of the elements in the array are not used  only index are used
      (_, index) => !selectedIndices.includes(index)
    );
    setImages(updatedImages);
    //empty selected image
    setSelectedIndices([]);
  };


  //image drag and add a dynamic class
  const handleImageDragStart = (event, index) => {
    
    const data = event.dataTransfer;
    data.setData("text/plain", index);

    // Add a class to the dragged image
    event.target.classList.add("dragging");
  };

  const handleImageDragOver = (event, index) => {
    event.preventDefault();
  };

 
 
  //handleing drag and drop event
  const handleImageDrop = (event, targetIndex) => {
    event.preventDefault();

    const data = event.dataTransfer.getData("text/plain");
    const draggedIndex = parseInt(data, 10);

    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      const updatedImages = [...images];
      const [draggedImage] = updatedImages.splice(draggedIndex, 1);
      updatedImages.splice(targetIndex, 0, draggedImage);
      setImages(updatedImages);
    }

    // Remove the class from the dragged image
    const draggedImage = document.querySelector(".image.dragging");
    if (draggedImage) {
      draggedImage.classList.remove("dragging");
    }
  };

  return (
    <>
      <div className="flex justify-between py-4">
        {selectedIndices.length > 0 ? (
          " "
        ) : (
          <h2 className="text-3xl font-bold">Gallery</h2>
        )}
        {selectedIndices.length > 0 ? (
          <h2 className="text-xl mt-4">
            {selectedIndices.length > 0 ? (
              <input type="checkbox" checked />
            ) : (
              " "
            )}
            {selectedIndices.length > 0 ? selectedIndices.length : " "} file
            selected
          </h2>
        ) : (
          " "
        )}

        {selectedIndices.length > 0 ? (
          <button
            className="bg-red-500 text-white p-2 rounded-md mt-4"
            onClick={handleDeleteSelectedImages}
          >
            Delete
          </button>
        ) : (
          " "
        )}
      </div>
      <div className="pb-6">
        <hr className="h-[1px] bg-[#333]"/>
      </div>
      <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-5 gap-6">
        {images.map((image, index) => (
          <div
            className={`${
              index === 0 ? "row-span-2 col-span-2" : ""
            } relative border image-container flex justify-center items-center`}
            key={index}
            onDragOver={(event) => handleImageDragOver(event, index)}
            onDrop={(e) => handleImageDrop(e, index)}
          >
            <div className="image-container-inner relative">
              <div className="image-container">
                <input
                  className="checkboxx checkHover"
                  type="checkbox"
                  checked={selectedIndices.includes(index)}
                  onChange={() => handleImageClick(index)}
                />
                <img
                  src={image.url}
                  alt={`Image ${index}`}
                  className="image"
                  draggable
                  onDragStart={(e) => handleImageDragStart(e, index)}
                  data-index={index}
                />
              </div>
              <div className="overlay"></div>
            </div>
          </div>
        ))}

        <div
          className=" outline-dotted outline-2 outline-offset-2 imgCursor w-[130px] md:w-[230px] h-[135px] md:h-[202px] pl-6  flex justify-center items-center"
          onClick={handleImageInputClick}
        >
          <img
            className="w-[100px] md:w-[160px] lg:w-[160px]"
            src="/image/upload.jpg"
            alt=""
          />
          <input
            type="file"
            ref={inputRef}
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </div>
      </div>
    </>
  );
}

export default App;
