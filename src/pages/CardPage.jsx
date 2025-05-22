import React, { useEffect, useState } from 'react';
    import { useParams, Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Home, UserCircle, Loader2 } from 'lucide-react';
    import CardPreview from '@/components/CardPreview'; // Use CardPreview component

    const CardPage = () => {
      const { username } = useParams();
      const [profile, setProfile] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [profileImageSrc, setProfileImageSrc] = useState(null); // Keep for potential specific logic if needed

      useEffect(() => {
        const fetchProfileData = async () => {
          try {
            setLoading(true);
            setError(null);
            setProfileImageSrc(null); // Reset

            let foundProfile = null;
            const localProfiles = JSON.parse(localStorage.getItem('userProfiles')) || [];
            foundProfile = localProfiles.find(p => p.username === username);

            if (foundProfile) {
              // Image for CardPreview will be handled by its own logic based on profile.image
              // If image is base64, it will be used directly. If it's a filename, CardPreview will prepend /profile_pics/
              // No need to set profileImageSrc separately here unless there's a very specific override needed for this page only.
            } else {
              const response = await fetch('/data.json'); 
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const allServerProfiles = await response.json();
              foundProfile = allServerProfiles.find(p => p.username === username);
               // Again, CardPreview will handle image path based on foundProfile.image
            }
            
            if (foundProfile) {
              setProfile(foundProfile);
               // Add to recent cards
              const recentCards = JSON.parse(localStorage.getItem('recentCards')) || [];
              const existingIndex = recentCards.findIndex(card => card.username === username);
              if (existingIndex > -1) {
                recentCards.splice(existingIndex, 1); // Remove if exists to add to top
              }
              recentCards.unshift({ username: foundProfile.username, name: foundProfile.name, type: 'viewed' });
              localStorage.setItem('recentCards', JSON.stringify(recentCards.slice(0, 10))); // Keep last 10
            } else {
              setError(`Profil für "${username}" nicht gefunden.`);
            }
          } catch (e) {
            console.error("Fehler beim Laden der Profildaten:", e);
            setError("Fehler beim Laden der Profildaten. Bitte versuchen Sie es später erneut.");
          } finally {
            setLoading(false);
          }
        };

        fetchProfileData();
      }, [username]);

      if (loading) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] text-slate-300">
            <Loader2 className="w-16 h-16 animate-spin text-sky-500 mb-4" />
            <p className="text-xl">Lade Profil...</p>
          </div>
        );
      }

      if (error || !profile) {
        return (
          <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-800/50 backdrop-blur-md rounded-xl shadow-2xl border border-slate-700">
            <UserCircle className="w-24 h-24 text-red-400 mb-6" />
            <h1 className="text-3xl font-bold text-red-400 mb-4">Fehler</h1>
            <p className="text-slate-300 mb-6">{error || `Das Profil für "${username}" konnte nicht gefunden werden.`}</p>
            <Button asChild variant="outline" className="border-sky-500 text-sky-400 hover:bg-sky-500 hover:text-slate-900">
              <Link to="/"><Home className="mr-2 h-4 w-4" /> Zurück zur Startseite</Link>
            </Button>
          </div>
        );
      }
      
      // Construct full profile data for CardPreview, including image handling.
      // CardPreview expects `image` to be either a base64 string or a filename.
      let displayImage = profile.image; // This might be a filename or undefined
      if (profile.image && !profile.image.startsWith('data:image')) { // If it's not base64, try to load from local storage
         const storedImage = localStorage.getItem(`profileImage_${username}`);
         if (storedImage && storedImage.startsWith('data:image')) {
            displayImage = storedImage; // Use stored base64 image
         }
      }


      const profileForPreview = {
        ...profile,
        image: displayImage, // Pass the correctly resolved image path or data URL
      };


      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg mx-auto my-8"
        >
          <CardPreview profileData={profileForPreview} themeColors={profile.themeColors} />
          <div className="text-center mt-8">
            <Button asChild variant="ghost" className="text-sky-400 hover:text-sky-300 hover:bg-sky-500/10">
              <Link to="/"><Home className="mr-2 h-4 w-4" />Zurück zur Startseite</Link>
            </Button>
          </div>
        </motion.div>
      );
    };

    export default CardPage;