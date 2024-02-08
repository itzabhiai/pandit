
import React, { useState, useEffect } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { storage, textdb } from '../../firebaseConfig';
import { doc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./UserAdmin.css"
import 'react-quill/dist/quill.snow.css';
export const UploadCarousal = () => {
    const [title, setTitle] = useState('');

    const [p1, setP1] = useState('');
    const [link, setLink] = useState('');

    const [image, setImage] = useState(null);
    const [Carousals, loading, error] = useCollection(collection(textdb, 'Carousals'));
   

;

    const handleUpload = async () => {
        if (!title || !p1|| !link || !image) {
            toast.error('Please fill in all fields');
            return;
        }

        toast.info('Uploading...', { autoClose: 3000 });

        try {
            const imageRef = ref(storage, `Carousal_images/${image.name}`);
            await uploadBytes(imageRef, image);
            const imageUrl = await getDownloadURL(imageRef);

            const timestamp = new Date();

            // Create a new document reference for each Carousal entry
            const newCarousalRef = doc(collection(textdb, 'Carousals'));

            // Set the data for the new Carousal entry
            await setDoc(newCarousalRef, {
                title,
                link,
                p1,
                imageUrl,


            });

            toast.success('Carousal uploaded successfully!');
            setTitle('');
            setLink('')
            setP1('');
            setImage(null);

        } catch (error) {
            console.error('Error uploading Carousal:', error);
            toast.error('Error uploading Carousal');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(textdb, 'Carousals'));
                querySnapshot.forEach((doc) => {
                    console.log(doc.id, ' => ', doc.data());
                });
            } catch (error) {
                console.error('Error fetching Carousals:', error);
            }
        };

        fetchData();
    }, []);

    // const handleDelete = async (CarousalId, imageUrl) => {
    //     try {
    //         const CarousalRef = doc(collection(textdb, 'Carousals'), CarousalId);

          
    //         await deleteDoc(CarousalRef);

    //         // Delete the image from storage
    //         const imageRef = ref(storage, `Carousal_images/${imageUrl}`);
    //         await deleteObject(imageRef);

    //         toast.success('Carousal deleted successfully!');
    //     } catch (error) {
    //         console.error('Error deleting Carousal:', error);
    //         toast.error('Error deleting Carousal');
    //     }
    // };



    return (
        <div className='mainup'>
            <div className='MainuploadCarousal'>
                <div className='uploadCarousal1'>
                    <h2>Upload Carousal</h2>
                    <div className='uploadCarousal'>
                        <label>Title:</label>
                        <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div className='uploadCarousal'>
                        <label>Description</label>
                        <input type='text' value={p1} onChange={(e) => setP1(e.target.value)} />
                    </div>
                  
                   

                    <button className='uplodbtn' onClick={handleUpload}>
                        Upload
                    </button>
                </div>
                <hr />

                <h2>Carousal List</h2>
                {loading && <p>Loading...</p>}
                {error && <p>Error fetching Carousals</p>}
                {Carousals && (
                    <div>
                        {Carousals.docs.map((Carousal) => {
                            const data = Carousal.data();
                            return (
                                <div className='dismain'>
                                    <div className='DisplayCard' key={Carousal.id} >
                                        <img src={data.imageUrl} alt={data.title} style={{ maxWidth: '100%' }} />
                                        

                                        <h3 className='btitle'>{data.title}</h3>
                                        <p className='Carousalp'>{data.p1}</p>
                                        <p className='Carousalp'>{data.link}</p>


                                        <button className='bn11' onClick={() => handleDelete(Carousal.id)}>Delete</button>
                                    </div>  </div>
                            );
                        })}
                    </div>
                )}

                <ToastContainer />
            </div>


        </div>
    );
};
