import React, { useState, ChangeEvent, FormEvent } from 'react';
import "./RegistrationPageStyle.css"

export const RegistrationPage : React.FC = () => {
    const [name, setName] = useState<string>('');
    const [rating, setRating] = useState<number>(1);
    const [description, setDescription] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value);
    };

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setImage(event.target.files[0]);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!image) {
            console.error('Image is required');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const base64Image = reader.result?.toString();
            if (base64Image) {
                const payload = {
                    name,
                    description,
                    rating,
                    imageData: base64Image
                };
                sendRegistrationData(payload);
            }
        };
        reader.readAsDataURL(image);
    };

    const sendRegistrationData = async (payload: any) => {
        try {
            const payloadSizeInBytes = JSON.stringify(payload).length * 2;
            console.log(`Payload size: ${payloadSizeInBytes} bytes`);

            const response = await fetch('http://192.168.1.176:4000/movies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                console.log('Registration successful');
            } else {
                console.error('Registration failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="registration-container">
            <h2 className="headline">Register a new movie</h2>
            <form onSubmit={handleSubmit} className="registration-form">
                <div className="form-line">
                    <label htmlFor="name" className="label">Name:</label>
                    <input id="name" type="text" value={name} onChange={handleNameChange} required className="input" />
                </div>
                <div className="form-line">
                    <label htmlFor="description" className="label">Description:</label>
                    <textarea id="description" value={description} onChange={handleDescriptionChange} required className="textarea" />
                </div>
                <div className="form-line">
                    <label htmlFor="image" className="label">Image:</label>
                    <input id="image" type="file" accept="image/*" onChange={handleImageChange} required className="input" />
                </div>
                <div className="form-line">
                    <label className="label">Rating:</label>
                    <div className="stars-container">
                        {[...Array(5)].map((_, index)=> {
                            const ratingValue = index + 1;
                            return (
                                <span
                                    className="star"
                                    key={ratingValue}
                                    onClick={() => {setRating(ratingValue)}}
                                    style={{color: ratingValue <= Number(rating) ? 'gold' : 'grey', cursor:"pointer"}}
                                >
                                    ★
                                </span>
                            );
                        })}
                    </div>
                </div>
                <button type="submit" className="button">Register</button>
            </form>
        </div>
    );
}

export default RegistrationPage;
