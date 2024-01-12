import React, { useState, useEffect } from 'react';

const Card = () => {
    const [Consumed, setTotalConsumed] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:3001/getTotalConsumed");
                const data = await response.json();
                setTotalConsumed(data.totalConsumed);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching total consumed data:', error);
            }
        };

        fetchData();
    }, []);

    const cardStyle = {
        width: '200px',
        height: '150px',
    };

    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="card-deck d-flex" style={{ gap: '20px' }}>
                <div className="card" style={cardStyle}>
                    <div className="card-content">
                        <h4 className="card-title">Total Gallons</h4>
                        <p className="card-text text-black">{loading ? 'Loading...' : 'Data not available'}</p>
                    </div>
                </div>
                <div className="card" style={cardStyle}>
                    <div className="card-content">
                        <h4 className="card-title">Consumed</h4>
                        <p className="card-text text-black">{loading ? 'Loading...' : Consumed}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
