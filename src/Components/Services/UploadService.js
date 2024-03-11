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
import Dashboard from '../../Admin/Dashboard/Dashboard';

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

  const handleUpload = async () => {
    if (!title || !content || !p1 ||  !thumbnail) {
      toast.error('Please fill in all fields and select at least one image and thumbnail');
      return;
    }

    toast.info('Uploading...', { autoClose: 3000 });

    try {
      const thumbnailRef = ref(storage, `Service_thumbnails/${thumbnail.name}`);
      await uploadBytes(thumbnailRef, thumbnail);
      const thumbnailUrl = await getDownloadURL(thumbnailRef);

      const timestamp = new Date();
      const newServiceRef = doc(collection(textdb, 'Services'));

      await setDoc(newServiceRef, {
        title,
        content,
        p1,
        thumbnail: thumbnailUrl,
        timestamp,
      });

      toast.success('Service uploaded successfully!');
      setTitle('');
      setContent('');
      setP1('');
      setThumbnail('');
      setThumbnailPreview('');
      setContact('');
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
                    ['link'],
                    ['clean']
                  ],
                },
              }}
              formats={[
                'header', 'font', 'size',
                'bold', 'italic', 'underline', 'strike', 'blockquote',
                'list', 'bullet', 'indent',
                'link'
              ]}
              className="custom-quill"
            />
          </div>
          <br/>
          <button className='uplodbtn' onClick={handleUpload}>
            Upload 
          </button>
          <br/>
        </div>
        <hr />
        {/* <Dashboard totalServices={Services && Services.docs.length} /> */}
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
