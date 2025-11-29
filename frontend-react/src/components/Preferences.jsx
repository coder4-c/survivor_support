import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Sun, Moon, Globe } from 'lucide-react';

const Preferences = () => {
  const { theme, toggleTheme, isDark, isLight } = useTheme();
  const { language, changeLanguage, t } = useLanguage();
  const { user, updatePreferences } = useAuth();

  const handleThemeChange = async () => {
    try {
      const newTheme = isLight ? 'dark' : 'light';
      
      // Update backend
      if (user) {
        await updatePreferences({ theme: newTheme });
      } else {
        // If not authenticated, just update locally
        const { changeTheme } = useTheme();
        changeTheme(newTheme);
      }
    } catch (error) {
      console.error('Error updating theme:', error);
      // Still update locally even if backend update fails
      toggleTheme();
    }
  };

  const handleLanguageChange = async (newLanguage) => {
    try {
      // Update backend
      if (user) {
        await updatePreferences({ language: newLanguage });
      } else {
        // If not authenticated, just update locally
        changeLanguage(newLanguage);
      }
    } catch (error) {
      console.error('Error updating language:', error);
      // Still update locally even if backend update fails
      changeLanguage(newLanguage);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          {t('settings')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Selection */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">{t('themePreferences')}</h3>
          <div className="flex gap-2">
            <Button
              variant={isLight ? "default" : "outline"}
              size="sm"
              onClick={handleThemeChange}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Sun className="w-4 h-4" />
              {t('lightMode')}
            </Button>
            <Button
              variant={isDark ? "default" : "outline"}
              size="sm"
              onClick={handleThemeChange}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Moon className="w-4 h-4" />
              {t('darkMode')}
            </Button>
          </div>
        </div>

        {/* Language Selection */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">{t('languagePreferences')}</h3>
          <div className="flex gap-2">
            <Button
              variant={language === 'en' ? "default" : "outline"}
              size="sm"
              onClick={() => handleLanguageChange('en')}
              className="flex-1"
            >
              {t('english')}
            </Button>
            <Button
              variant={language === 'sw' ? "default" : "outline"}
              size="sm"
              onClick={() => handleLanguageChange('sw')}
              className="flex-1"
            >
              {t('swahili')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Preferences;