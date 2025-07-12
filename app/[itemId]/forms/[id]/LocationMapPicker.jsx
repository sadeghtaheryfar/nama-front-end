// components/map/LocationMapPicker.jsx
"use client"; // این خط برای Client Component بودن در Next.js ضروری است

import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // استایل‌های Leaflet

// رفع مشکل آیکون‌های پیش‌فرض Leaflet در برخی محیط‌ها
// این کد باید قبل از استفاده از L در هر جایی اجرا شود
const L = typeof window !== 'undefined' ? require('leaflet') : null;
if (L) {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
}

const LocationMapPicker = ({ initialPosition, onSelectPosition }) => {
  const [position, setPosition] = useState(initialPosition || [35.6892, 51.3890]); // پیش‌فرض تهران
  const mapRef = useRef(null); // رفرنس برای دسترسی به شیء نقشه Leaflet

  // هوک برای مدیریت رویدادهای نقشه
  const MapEventsHandler = () => {
    const map = useMapEvents({
      click: (e) => {
        const newLatlng = [e.latlng.lat, e.latlng.lng];
        setPosition(newLatlng); // به‌روزرسانی موقعیت مارکر داخلی
        onSelectPosition({ lat: e.latlng.lat, lng: e.latlng.lng }); // ارسال به فرم بیرونی
        console.log("Map clicked at:", e.latlng); // لاگ برای عیب‌یابی
      },
      // می‌توانید رویدادهای دیگر مانند dragend را نیز اضافه کنید
      // dragend: () => {
      //   if (mapRef.current) {
      //     const center = mapRef.current.getCenter();
      //     setPosition([center.lat, center.lng]);
      //     onSelectPosition({ lat: center.lat, lng: center.lng });
      //     console.log("Map dragged to center:", center);
      //   }
      // }
    });
    return null;
  };

  // هر زمان که initialPosition از بیرون تغییر کرد (مثلاً توسط فرم)، موقعیت را به‌روز کن
  useEffect(() => {
    if (initialPosition && (position[0] !== initialPosition[0] || position[1] !== initialPosition[1])) {
      setPosition(initialPosition);
      if (mapRef.current) {
        mapRef.current.setView(initialPosition, mapRef.current.getZoom());
      }
    }
  }, [initialPosition]);


  return (
    <MapContainer
      center={position} // از موقعیت داخلی استفاده می‌کند
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%', minHeight: '250px' }} // اطمینان از ارتفاع کافی
      whenCreated={mapInstance => { mapRef.current = mapInstance; }} // ذخیره رفرنس به شیء نقشه
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEventsHandler /> {/* کامپوننت مدیریت رویدادها */}
      {position && <Marker position={position} />} {/* نمایش مارکر */}
    </MapContainer>
  );
};

export default LocationMapPicker;