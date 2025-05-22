import React, { useState, useEffect } from 'react';
    import { useNavigate, Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { ColorPickerInput } from '@/components/ui/color-picker-input';
    import { useToast } from '@/components/ui/use-toast';
    import { Home, Save, Plus, Trash2, Palette } from 'lucide-react';
    import CardPreview from '@/components/CardPreview';

    const CreateCardPage = () => {
      const navigate = useNavigate();
      const { toast } = useToast();
      const [formData, setFormData] = useState({
        username: '',
        name: '',
        image: '', 
        imageName: '', 
        role: '',
        description: '',
        links: [{ label: '', url: '' }],
        videoLink: '',
        themeColors: {
          primary: '#0ea5e9', // sky-500
          secondary: '#2dd4bf', // teal-400
          text: '#e2e8f0', // slate-200
          accentText: '#67e8f9', // cyan-300
          cardBg: 'rgba(15, 23, 42, 0.7)', // slate-900 with opacity
        }
      });

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };

      const handleColorChange = (colorName, value) => {
        setFormData(prev => ({
          ...prev,
          themeColors: {
            ...prev.themeColors,
            [colorName]: value,
          }
        }));
      };

      const handleLinkChange = (index, e) => {
        const { name, value } = e.target;
        const newLinks = [...formData.links];
        newLinks[index][name] = value;
        setFormData(prev => ({ ...prev, links: newLinks }));
      };

      const addLinkField = () => {
        setFormData(prev => ({ ...prev, links: [...prev.links, { label: '', url: '' }] }));
      };

      const removeLinkField = (index) => {
        const newLinks = formData.links.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, links: newLinks }));
      };
      
      const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
          if (file.size > 2 * 1024 * 1024) { // 2MB limit
            toast({
              variant: "destructive",
              title: "Fehler beim Hochladen",
              description: "Die Bilddatei darf maximal 2MB groß sein.",
            });
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormData(prev => ({ ...prev, image: reader.result, imageName: file.name }));
          };
          reader.readAsDataURL(file);
        }
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.username || !formData.name) {
          toast({
            variant: "destructive",
            title: "Fehler",
            description: "Benutzername und Name sind Pflichtfelder.",
          });
          return;
        }

        const existingProfiles = JSON.parse(localStorage.getItem('userProfiles')) || [];
        if (existingProfiles.some(p => p.username === formData.username)) {
           toast({
            variant: "destructive",
            title: "Fehler",
            description: "Dieser Benutzername ist bereits vergeben. Bitte wählen Sie einen anderen.",
          });
          return;
        }
        
        const profileToSave = { ...formData };
        if (formData.imageName && formData.image && typeof formData.image === 'string' && formData.image.startsWith('data:image')) {
          profileToSave.image = formData.imageName; // Store only name if it's a new upload
        } else if (formData.image && typeof formData.image === 'string' && !formData.image.startsWith('data:image')) {
          // It's likely already a filename from a pre-existing default card
          profileToSave.image = formData.image;
        } else {
           delete profileToSave.image; // No image or invalid
        }
        delete profileToSave.imageName; // Don't save imageName separately in final profile data if image is a data URL

        existingProfiles.push(profileToSave);
        localStorage.setItem('userProfiles', JSON.stringify(existingProfiles));
        
        if (formData.image && typeof formData.image === 'string' && formData.image.startsWith('data:image') && formData.imageName) {
          localStorage.setItem(`profileImage_${formData.username}`, formData.image); // Store base64 image
        }

        toast({
          title: "Erfolg!",
          description: `Visitenkarte für ${formData.name} wurde erstellt.`,
          className: "bg-green-500 text-white",
        });
        navigate(`/card/${formData.username}`);
      };
      
      const qrCodeUrl = formData.username ? `${window.location.origin}/card/${formData.username}` : '';


      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-800/70 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl border border-slate-700 w-full mx-auto my-8"
        >
          <h1 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300">Neue Visitenkarte erstellen</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <form onSubmit={handleSubmit} className="space-y-6 md:pr-4 md:border-r md:border-slate-700">
              <div>
                <Label htmlFor="username" className="text-sky-300">Benutzername (für URL)</Label>
                <Input id="username" name="username" value={formData.username} onChange={handleChange} required className="bg-slate-700 border-slate-600 text-slate-50 placeholder:text-slate-400" />
              </div>
              <div>
                <Label htmlFor="name" className="text-sky-300">Voller Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="bg-slate-700 border-slate-600 text-slate-50 placeholder:text-slate-400" />
              </div>
              <div>
                <Label htmlFor="imageFile" className="text-sky-300">Profilbild (max. 2MB)</Label>
                <Input id="imageFile" name="imageFile" type="file" accept="image/png, image/jpeg, image/gif" onChange={handleImageUpload} className="bg-slate-700 border-slate-600 text-slate-50 file:text-sky-400 file:font-semibold" />
              </div>
              <div>
                <Label htmlFor="role" className="text-sky-300">Rolle/Position</Label>
                <Input id="role" name="role" value={formData.role} onChange={handleChange} className="bg-slate-700 border-slate-600 text-slate-50 placeholder:text-slate-400" />
              </div>
              <div>
                <Label htmlFor="description" className="text-sky-300">Beschreibung</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="bg-slate-700 border-slate-600 text-slate-50 placeholder:text-slate-400" />
              </div>
              
              <div>
                <Label className="text-sky-300 mb-2 block">Links</Label>
                {formData.links.map((link, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Input name="label" placeholder="Label" value={link.label} onChange={(e) => handleLinkChange(index, e)} className="bg-slate-700 border-slate-600 text-slate-50 placeholder:text-slate-400 flex-1" />
                    <Input name="url" type="url" placeholder="URL" value={link.url} onChange={(e) => handleLinkChange(index, e)} className="bg-slate-700 border-slate-600 text-slate-50 placeholder:text-slate-400 flex-1" />
                    {formData.links.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeLinkField(index)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addLinkField} className="text-teal-300 border-teal-500 hover:bg-teal-500/20 hover:text-teal-200">
                  <Plus className="mr-2 h-4 w-4" /> Link hinzufügen
                </Button>
              </div>

              <div>
                <Label htmlFor="videoLink" className="text-sky-300">YouTube Video Link</Label>
                <Input id="videoLink" name="videoLink" type="url" value={formData.videoLink} onChange={handleChange} className="bg-slate-700 border-slate-600 text-slate-50 placeholder:text-slate-400" />
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-700">
                <Label className="text-xl font-semibold text-sky-300 flex items-center"><Palette className="mr-2 h-5 w-5"/>Kartenfarben anpassen</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ColorPickerInput label="Primärfarbe (Akzente, Rahmen)" id="primaryColor" value={formData.themeColors.primary} onChange={(e) => handleColorChange('primary', e.target.value)} />
                    <ColorPickerInput label="Sekundärfarbe (Buttons, Info-Texte)" id="secondaryColor" value={formData.themeColors.secondary} onChange={(e) => handleColorChange('secondary', e.target.value)} />
                    <ColorPickerInput label="Textfarbe (Haupttext)" id="textColor" value={formData.themeColors.text} onChange={(e) => handleColorChange('text', e.target.value)} />
                    <ColorPickerInput label="Akzenttextfarbe (Name Gradient)" id="accentTextColor" value={formData.themeColors.accentText} onChange={(e) => handleColorChange('accentText', e.target.value)} />
                    <ColorPickerInput label="Kartenhintergrund" id="cardBgColor" value={formData.themeColors.cardBg} onChange={(e) => handleColorChange('cardBg', e.target.value)} />
                </div>
              </div>


              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 pt-6 border-t border-slate-700">
                <Button type="submit" className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-slate-50">
                  <Save className="mr-2 h-5 w-5" /> Karte speichern
                </Button>
                <Button asChild variant="ghost" className="w-full sm:w-auto text-sky-400 hover:text-sky-300 hover:bg-sky-500/10">
                  <Link to="/"><Home className="mr-2 h-4 w-4" />Zurück zur Startseite</Link>
                </Button>
              </div>
            </form>

            <div className="md:pl-4">
              <h2 className="text-2xl font-semibold text-center mb-4 text-sky-300">Live-Vorschau</h2>
              <div className="sticky top-24"> {/* Make preview sticky */}
                <CardPreview profileData={formData} themeColors={formData.themeColors} />
              </div>
            </div>
          </div>
        </motion.div>
      );
    };

    export default CreateCardPage;