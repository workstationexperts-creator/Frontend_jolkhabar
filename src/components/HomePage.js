import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = ({ categories }) => {

    return (
        <main>
            {/* Top Hero Banner */}
            <div className="banner-section">
                <img
                    src="/images/WebsiteLongBanners/Jolkhabar Homepage Main.jpg"
                    alt="Jolkhabar Banner"
                    className="background-image"
                />
            </div>

            <div className="container page-content category-layout">
                {(categories || []).map(category => (
                    <Link
                        to={`/category/${category.id}`}
                        key={category.id}
                        className={`category-card ${category.layoutType?.toUpperCase() === "WIDE" ? "wide" : "square"}`}
                    >
                        <img
                            src={category.imageUrl || "https://placehold.co/600x400?text=No+Image"}
                            alt={category.name}
                            className="category-image"
                        />
                    </Link>

                ))}
            </div>

            {/* Available At Section */}
            <div className="available-at-section">
                <h2>Available At</h2>
                <div className="logo-container">
                    <img src="/Assets/BlinkitLogo.png" alt="Blinkit" className="available-logo" />
                    <img src="/Assets/BigbasketLOgo.png" alt="Bigbasket" className="available-logo" />
                    <img src="/Assets/Instamart logo.avif" alt="Instamart" className="available-logo" />
                    <img src="/Assets/ZeptoLogo.png" alt="Zepto" className="available-logo" />
                    <img src="/Assets/AmazonLogo.png" alt="Amazon" className="available-logo" />
                    <img src="/Assets/FlipkartLogo.png" alt="Flipkart" className="available-logo" />
                    <img src="/Assets/EtsyLogo.png" alt="Etsy" className="available-logo" />
                    <img src="/Assets/ebay-icon-2048x2048-2vonydav.png" alt="Ebay" className="available-logo" />
                </div>
            </div>

        </main>
    );
};

export default HomePage;
