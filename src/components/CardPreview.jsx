import React from 'react';
    import QRCode from 'qrcode.react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Link as LinkIcon, Youtube, UserCircle, Briefcase, Info } from 'lucide-react';

    const CardPreview = ({ profileData, themeColors }) => {
      const {
        name,
        username,
        role,
        description,
        links,
        videoLink,
        image, 
      } = profileData;

      const currentUrl = username ? `${window.location.origin}/card/${username}` : '';

      const getYouTubeEmbedUrl = (url) => {
        if (!url) return null;
        const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : null;
      };
      const embedUrl = getYouTubeEmbedUrl(videoLink);

      const primaryColor = themeColors?.primary || '#0ea5e9'; // sky-500
      const secondaryColor = themeColors?.secondary || '#2dd4bf'; // teal-400
      const textColor = themeColors?.text || '#e2e8f0'; // slate-200
      const accentTextColor = themeColors?.accentText || '#67e8f9'; // cyan-300
      const cardBgColor = themeColors?.cardBg || 'rgba(15, 23, 42, 0.7)'; // slate-900 with opacity

      const cardStyle = {
        backgroundColor: cardBgColor,
        borderColor: primaryColor,
        color: textColor,
      };

      const nameStyle = {
        backgroundImage: `linear-gradient(to right, ${primaryColor}, ${accentTextColor})`,
      };
      
      const roleStyle = {
        color: secondaryColor,
      };

      const linkButtonStyle = {
        borderColor: secondaryColor,
        color: secondaryColor,
      };
      
      const linkButtonHoverStyle = `hover:bg-[${secondaryColor}] hover:bg-opacity-20 hover:text-[${secondaryColor}-200]`;

      const headerStyle = {
        color: primaryColor,
      };

      const iconStyle = {
        color: secondaryColor,
      }


      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="backdrop-blur-lg p-6 rounded-2xl shadow-2xl border w-full max-w-md mx-auto my-4"
          style={cardStyle}
        >
          <div className="flex flex-col items-center text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {image && typeof image === 'string' && image.startsWith('data:image') ? (
                <img-replace
                  src={image}
                  alt={`${name || 'Profil'}'s Profilbild`}
                  className="w-32 h-32 rounded-full object-cover mb-6 border-4 shadow-lg"
                  style={{ borderColor: primaryColor }} />
              ) : image ? (
                 <img-replace
                  src={`/profile_pics/${image}`}
                  alt={`${name || 'Profil'}'s Profilbild`}
                  className="w-32 h-32 rounded-full object-cover mb-6 border-4 shadow-lg"
                  style={{ borderColor: primaryColor }} />
              ) : (
                <div 
                  className="w-32 h-32 rounded-full bg-slate-700 flex items-center justify-center mb-6 border-4 shadow-lg"
                  style={{ borderColor: primaryColor }}
                >
                  <UserCircle className="w-20 h-20 text-slate-500" />
                </div>
              )}
            </motion.div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent mb-1" style={nameStyle}>
              {name || "Dein Name"}
            </h1>
            <p className="text-lg mb-3 flex items-center justify-center" style={roleStyle}>
              <Briefcase className="mr-2 h-5 w-5" />{role || "Deine Rolle"}
            </p>
            <p className="mb-6 text-sm leading-relaxed px-2 flex items-start">
                <Info className="mr-2 h-5 w-5 flex-shrink-0 mt-1" style={iconStyle} />
                {description || "Eine kurze Beschreibung über dich."}
            </p>
          </div>

          {links && links.filter(link => link.label && link.url).length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-center flex items-center justify-center" style={headerStyle}>
                <LinkIcon className="mr-2 h-5 w-5" />Links
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {links.filter(link => link.label && link.url).map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                    whileHover={{ y: -3 }}
                  >
                    <Button variant="outline" className={`w-full transition-all duration-200 ${linkButtonHoverStyle}`} style={linkButtonStyle}>
                      {link.label}
                    </Button>
                  </motion.a>
                ))}
              </div>
            </div>
          )}

          {embedUrl && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3 text-center flex items-center justify-center" style={headerStyle}>
                <Youtube className="mr-2 h-5 w-5 text-red-500" />Video
              </h2>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg border" style={{borderColor: primaryColor}}>
                <iframe
                  src={embedUrl}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          )}
          
          {currentUrl && (
            <div className="flex flex-col items-center mb-6">
              <h2 className="text-xl font-semibold mb-3" style={headerStyle}>QR-Code</h2>
              <motion.div 
                className="p-3 bg-white rounded-lg shadow-md inline-block border"
                style={{borderColor: primaryColor}}
                whileHover={{ scale: 1.05 }}
              >
                <QRCode value={currentUrl} size={128} bgColor="#ffffff" fgColor="#0f172a" level="H" />
              </motion.div>
              <p className="text-xs mt-2" style={{color: secondaryColor}}>Scannen, um dieses Profil zu teilen</p>
            </div>
          )}
        </motion.div>
      );
    };

    export default CardPreview;