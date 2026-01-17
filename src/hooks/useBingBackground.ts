import { useEffect, useState } from 'react';

export const useBingBackground = () => {
  const [backgroundUrl, setBackgroundUrl] = useState<string>('');

  useEffect(() => {
    const fetchBingImage = async () => {
      try {
        // Method 1: Try using Bing's public API through a CORS-friendly endpoint
        // This uses Bing's official HPImageArchive API which supports CORS
        const response = await fetch('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US');

        if (response.ok) {
          const data = await response.json();
          console.log('Bing API response:', data);

          if (data.images && data.images.length > 0) {
            // Get the full resolution image URL
            const imageUrl = `https://www.bing.com${data.images[0].url}`;
            console.log('Loading Bing image:', imageUrl);
            setBackgroundUrl(imageUrl);
            return;
          }
        }
      } catch (error) {
        console.error('Method 1 failed:', error);
      }

      try {
        // Method 2: Use a third-party CORS proxy service
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const bingApiUrl = encodeURIComponent('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US');

        const response = await fetch(`${proxyUrl}${bingApiUrl}`);

        if (response.ok) {
          const data = await response.json();
          console.log('Bing API response (via proxy):', data);

          if (data.images && data.images.length > 0) {
            const imageUrl = `https://www.bing.com${data.images[0].url}`;
            console.log('Loading Bing image via proxy:', imageUrl);
            setBackgroundUrl(imageUrl);
            return;
          }
        }
      } catch (error) {
        console.error('Method 2 failed:', error);
      }

      // Method 3: Use a community-maintained Bing wallpaper API
      try {
        const response = await fetch('https://bing.biturl.top/?resolution=1920&format=json&index=0&mkt=en-US');

        if (response.ok) {
          const data = await response.json();
          console.log('Bing wallpaper API response:', data);

          if (data.url) {
            console.log('Loading Bing image from wallpaper API:', data.url);
            setBackgroundUrl(data.url);
            return;
          }
        }
      } catch (error) {
        console.error('Method 3 failed:', error);
      }

      // Fallback: Use a beautiful default Bing wallpaper
      console.log('All methods failed, using fallback image');
      const fallbackUrl = 'https://www.bing.com/th?id=OHR.NaplesBasilica_EN-US0488733664_1920x1080.jpg';
      setBackgroundUrl(fallbackUrl);
    };

    fetchBingImage();
  }, []);

  return backgroundUrl;
};
