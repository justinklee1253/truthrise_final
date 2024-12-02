import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress
} from '@mui/material';
import { Delete, Visibility } from '@mui/icons-material';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

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
    <Box sx={{ width: '100%', minHeight: 'calc(100vh - 64px)', bgcolor: '#f5f7fa', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 4, color: '#1976d2' }}>
          Saved Articles
        </Typography>

        {articles.length === 0 ? (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="textSecondary">
              No saved articles yet.
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {articles.map((article) => (
              <Grid item xs={12} key={article.id}>
                <Card>
                  <CardContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {article.summary.substring(0, 200)}...
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="textSecondary">
                        Saved on: {new Date(article.created_at).toLocaleDateString()}
                      </Typography>
                      <Box>
                        <IconButton onClick={() => {
                          setSelectedArticle(article);
                          setDialogOpen(true);
                        }}>
                          <Visibility />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(article.id)} color="error">
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Article Details</DialogTitle>
          <DialogContent dividers>
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            <Typography variant="body1" paragraph>
              {selectedArticle?.summary}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Original Article
            </Typography>
            <Typography variant="body1">
              {selectedArticle?.original_text}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default SavedArticles;