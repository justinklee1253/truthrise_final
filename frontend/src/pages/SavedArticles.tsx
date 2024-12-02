import {
  Container,
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Paper
} from '@mui/material';
import { Delete, Visibility } from '@mui/icons-material';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { useState, useEffect } from 'react';

interface Article {
  id: string;
  original_text: string;
  summary: string;
  created_at: string;
}

const SavedArticles = () => {
  const { user } = useUser();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!user) return;
      try {
        const response = await axios.get(`http://localhost:8000/api/articles/${user.id}`);
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/articles/${id}`);
      setArticles(articles.filter(article => article.id !== id));
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      width: '100%',
      minHeight: 'calc(100vh - 64px)',
      background: 'linear-gradient(145deg, #f6f9fc 0%, #edf1f7 100%)',
      py: 6
    }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          sx={{ 
            mb: 4, 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Saved Articles
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {articles.length === 0 ? (
            <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
              <Typography color="textSecondary">
                No saved articles yet.
              </Typography>
            </Paper>
          ) : (
            articles
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((article) => (
                <Paper
                  key={article.id}
                  elevation={2}
                  sx={{
                    borderRadius: 2,
                    p: 3,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 2,
                      fontSize: '1.1rem',
                      lineHeight: 1.6
                    }}
                  >
                    {article.summary.length > 300 
                      ? `${article.summary.substring(0, 300)}...` 
                      : article.summary}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    pt: 2,
                    mt: 2
                  }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'text.secondary',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      Saved on: {new Date(article.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        onClick={() => {
                          setSelectedArticle(article);
                          setDialogOpen(true);
                        }}
                        sx={{ 
                          '&:hover': { 
                            color: 'primary.main',
                            bgcolor: 'primary.50'
                          }
                        }}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDelete(article.id)} 
                        sx={{ 
                          '&:hover': { 
                            color: 'error.main',
                            bgcolor: 'error.50'
                          }
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              ))
          )}
        </Box>

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            elevation: 3,
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ 
            borderBottom: '1px solid',
            borderColor: 'divider',
            pb: 2
          }}>
            Article Details
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ color: 'primary.main', mb: 2 }}
            >
              Summary
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
              {selectedArticle?.summary}
            </Typography>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ color: 'primary.main', mb: 2 }}
            >
              Original Article
            </Typography>
            <Typography variant="body1">
              {selectedArticle?.original_text}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button 
              onClick={() => setDialogOpen(false)}
              variant="outlined"
              sx={{ borderRadius: 1.5 }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default SavedArticles;