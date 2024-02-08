import React, { useState, useEffect } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { storage, textdb } from '../../firebaseConfig';
import { doc, setDoc, collection, getDocs, deleteDoc , query, where,getDoc,updateDoc} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./UploadService.css"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export const UploadService = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [p1, setP1] = useState('');
  const [images, setImages] = useState([]);
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState('');
  const [locationtxt, setLocationtxt] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);
  const [Services, loading, error] = useCollection(collection(textdb, 'Services'));
  const [selectedService, setSelectedService] = useState(null);
  const [thumbnail, setThumbnail] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  const handleImageChange = (e) => {
    const selectedFiles = e.target.files;
    const selectedPreviews = Array.from(selectedFiles).map((file) => URL.createObjectURL(file));

    setImages([...images, ...selectedFiles]);
    setImagePreviews([...imagePreviews, ...selectedPreviews]);
  };
  const handleThumbnailChange = (e) => {
    const selectedThumbnail = e.target.files[0];
    const thumbnailPreviewUrl = URL.createObjectURL(selectedThumbnail);

    setThumbnail(selectedThumbnail);
    setThumbnailPreview(thumbnailPreviewUrl);
  };

  const renderThumbnailPreview = () => {
    return (
      <div className='thumbnailPreview'>
        {thumbnailPreview && (
          <img
            src={thumbnailPreview}
            alt='Thumbnail Preview'
            style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '10px' }}
          />
        )}
      </div>
    );
  };


  const renderImagePreviews = () => {
    return (
      <div className='imagePreviews'>
        {imagePreviews.map((preview, index) => (
          <img key={index} src={preview} alt={`Preview ${index}`} style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '10px' }} />
        ))}
      </div>
    );
  };

  const handleUpload = async () => {
    if (!title || !content || !p1 || images.length === 0 || !thumbnail) {
      toast.error('Please fill in all fields and select at least one image and thumbnail');
      return;
    }

    toast.info('Uploading...', { autoClose: 3000 });

    try {
      // Upload thumbnail
      const thumbnailRef = ref(storage, `Service_thumbnails/${thumbnail.name}`);
      await uploadBytes(thumbnailRef, thumbnail);
      const thumbnailUrl = await getDownloadURL(thumbnailRef);

      const uploadTasks = images.map(async (selectedImage) => {
        const imageRef = ref(storage, `Service_images/${selectedImage.name}`);
        await uploadBytes(imageRef, selectedImage);
        return getDownloadURL(imageRef);
      });

      const imageUrls = await Promise.all(uploadTasks);

      const timestamp = new Date();
      const newServiceRef = doc(collection(textdb, 'Services'));

      await setDoc(newServiceRef, {
        title,
        content,
        p1,
        imageUrls,
        thumbnail: thumbnailUrl,
        timestamp,
        location,
        locationtxt,
        contact
      });

      toast.success('Service uploaded successfully!');
      setTitle('');
      setContent('');
      setP1('');
      setImages([]);
      setImagePreviews([]);
      setThumbnail('');
      setThumbnailPreview('');
      setContact('');
      setLocation('');
      setLocationtxt('')
    } catch (error) {
      console.error('Error uploading Service:', error);
      toast.error('Error uploading Service');
    }
  };
  const handleDelete = async (ServiceId, imageUrl) => {
    try {
      const ServiceRef = doc(collection(textdb, 'Services'), ServiceId);
  
      // Delete the document from Firestore
      await deleteDoc(ServiceRef);
  
      // Delete the image from storage
      const imageRef = ref(storage, `Service_images/${imageUrl}`);
      await deleteObject(imageRef);
  
      toast.success('Service deleted successfully!');
    } catch (error) {
      console.error('Error deleting Service:', error);
      toast.error('Error deleting Service');
    }
  };
  const handleDeleteImage = async (ServiceId, imageUrl) => {
    try {
      // Create a reference to the image in Firebase Storage
      const imageRef = ref(storage, imageUrl);
  
      // Delete the image from Firebase Storage
      await deleteObject(imageRef);
  
      // Get the specific Service reference
      const ServiceRef = doc(collection(textdb, 'Services'), ServiceId);
  
      // Fetch the Service document
      const ServiceDoc = await getDoc(ServiceRef);
  
      if (ServiceDoc.exists()) {
        const ServiceData = ServiceDoc.data();
  
        // Remove the deleted image URL from the array
        const updatedImageUrls = ServiceData.imageUrls.filter((url) => url !== imageUrl);
  
        // Update the Service document in Firestore with the new image URLs array
        await updateDoc(ServiceRef, {
          imageUrls: updatedImageUrls,
        });
  
        toast.success('Image deleted successfully from Firestore and Storage!');
      } else {
        toast.error('Service not found!');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Error deleting image');
    }
  };
  
  
  const handleAddMoreImages = async (ServiceId) => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = 'image/*';
      input.onchange = async (e) => {
        const selectedFiles = e.target.files;
        const uploadTasks = Array.from(selectedFiles).map(async (file) => {
          const imageRef = ref(storage, `Service_images/${file.name}`);
          await uploadBytes(imageRef, file);
          return getDownloadURL(imageRef);
        });
  
        const newImageUrls = await Promise.all(uploadTasks);
  
        // Get the specific Service reference
        const ServiceRef = doc(collection(textdb, 'Services'), ServiceId);
  
        // Fetch the Service document
        const ServiceDoc = await getDoc(ServiceRef);
  
        if (ServiceDoc.exists()) {
          const ServiceData = ServiceDoc.data();
  
          // Update the Service document in Firestore with the new image URLs array
          await updateDoc(ServiceRef, {
            imageUrls: [...ServiceData.imageUrls, ...newImageUrls],
          });
  
          toast.success('Images added successfully!');
        } else {
          toast.error('Service not found!');
        }
      };
      input.click();
    } catch (error) {
      console.error('Error adding images:', error);
      toast.error('Error adding images');
    }
  };
  
  return (
    <div className='Service-container'>
      <div className='MainuploadService'>
          <h2>Upload Service</h2>
        <div className='uploadService-card'>
          <div className='uploadService'>
            <label>Title:</label>
            <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className='uploadService'>
            <label>Description</label>
            <input type='text' value={p1} onChange={(e) => setP1(e.target.value)} />
          </div>
          <div className='uploadService'>
        <label>Thumbnail:</label>
        <input type='file' onChange={handleThumbnailChange} />
        {renderThumbnailPreview()}
      </div>
          <div className='uploadService'>
            <label>Images:</label>
            <input type='file' multiple onChange={handleImageChange} />
            {renderImagePreviews()}
          </div>
          <div className='uploadService'>
            <label>Contact Number:</label>
            <input type='text' value={contact} onChange={(e) => setContact(e.target.value)} />
          </div>
          <div className='uploadService'>
            <label>Location:</label>
            <input type='text' value={locationtxt} onChange={(e) => setLocationtxt(e.target.value)} />
          </div>
          <div className='uploadService'>
            <label>Google Map Location Url:</label>
            <input type='text' value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>

          <div className='uploadService'>
            <label>Content:</label>
            <ReactQuill
  value={content}
  onChange={(value) => setContent(value)}
  modules={{
    toolbar: {
      container: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link'], // Include the link option in the toolbar
        ['clean']
      ],
    },
  }}
  formats={[
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link' // Make sure 'link' format is included in the formats array
  ]}
  className="custom-quill"
/>

          </div>
          <br/>
          <button className='uplodbtn' onClick={handleUpload}>
            Upload 
          </button>
          <br/>
          ‎ 
        </div>
        <hr />

        
        <h2>Service List</h2>
        {loading && <p>Loading...</p>}
        {error && <p>Error fetching Service</p>}
        {Services && (
          <div>
            {Services.docs.map((Service) => {
              const data = Service.data();
              return (
                <div className='Service-upload-dislay' key={Service.id}>
                  <div className='Service-upload-dislay-card'>
                  <img  src={data.thumbnail} style={{ maxWidth: '100%' }} />
                  <h2 className=''>{data.title}</h2>
                    <div className='upload-display-imageContainer'>
                  {data.imageUrls &&
  data.imageUrls.map((imageUrl, index) => (
    <div key={index} className='upload-Service-gallery'>
      <img src={imageUrl} alt={`Image ${index}`}  />
      <button className='institiute-upload-gallery-btn' onClick={() => handleDeleteImage(Service.id, imageUrl)}>Delete</button>
      <button className='institiute-upload-gallery-btn' onClick={() => handleAddMoreImages(Service.id)}>Add More</button>
    </div>
  ))}
</div>
                    <div className=''>
                      
                    {/* <p className='Service-upload-display-p-time'>
                      {data.timestamp &&
                        new Date(data.timestamp.toDate()).toLocaleString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                    </p> */}
                    

{/*                     
                    <p className='Service-upload-display-p'>{data.contact}</p>
                    <p className='Service-upload-display-p'>{data.location}</p>
                    <p className='Service-upload-display-p'>{data.locationtxt}</p> */}
                    </div>
                    <button className='Service-all-data-dlt-btn' onClick={() => handleDelete(Service.id, data.imageUrls)}>Delete complete data</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};
