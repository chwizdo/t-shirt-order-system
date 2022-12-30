import { useState } from "react";
import { withFirebase } from "../services/Firebase";
import { withModelUtil } from "../services/ModelUtil";

const ImagePicker = ({ order, setOrder, modelUtil, firebase, index }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    modelUtil.getTreeInfo(order, `image${index}`)
  );

  return (
    <div className="aspect-square rounded-lg overflow-hidden border-2 border-grey">
      <input
        type="file"
        className="hidden"
        id={`image${index}`}
        accept="image/png,image/jpeg"
        onChange={async (e) => {
          if (!e.target.files || e.target.files.length === 0) return;
          setIsUploading(true);
          const orderId = modelUtil.getTreeId(order);
          const imagePath = `${orderId}${index}`;
          console.log(imagePath);
          await firebase.uploadImage(e.target.files[0], imagePath);
          const imageUrl = await firebase.getImageUrl(imagePath);
          setImageUrl(imageUrl);
          const o = modelUtil.updateTreeInfo(order, `image${index}`, imageUrl);
          setOrder(o);
          setIsUploading(false);
        }}
      />
      {isUploading ? (
        <div className="h-full w-full flex justify-center items-center">
          Uploading Image
        </div>
      ) : (
        <label htmlFor={`image${index}`}>
          {imageUrl ? (
            <img className="h-full w-full object-cover" src={imageUrl} />
          ) : (
            <div className="h-full w-full flex justify-center items-center">
              Select Image {index}
            </div>
          )}
        </label>
      )}
    </div>
  );
};

export default withFirebase(withModelUtil(ImagePicker));
