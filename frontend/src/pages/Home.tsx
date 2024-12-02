import { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import {
  AutoAwesome,
  School,
  Psychology,
  Language,
  BusinessCenter,
  FormatListBulleted,
  Article,
  Architecture,
  Science,
  TrendingUp,
  SaveAlt,
  Info as InfoOutlined,
} from '@mui/icons-material';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

interface SummaryResult {
  summary: string;
  metadata: {
    style_used: string;
    target_audience: string;
    focus_areas: string[];
    output_format: string;
    analysis_results: any;
  };
}

const Home = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const { user } = useUser();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [style, setStyle] = useState('balanced');
  const [targetAudience, setTargetAudience] = useState('general');
  const [outputFormat, setOutputFormat] = useState('default');
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const styles = {
    balanced: { icon: <AutoAwesome />, label: 'Balanced', desc: 'Objective and comprehensive' },
    academic: { icon: <School />, label: 'Academic', desc: 'Scholarly and methodological' },
    technical: { icon: <Science />, label: 'Technical', desc: 'Detailed technical focus' },
    simplified: { icon: <Language />, label: 'Simplified', desc: 'Clear and accessible' },
    critical: { icon: <Psychology />, label: 'Critical', desc: 'Analysis-focused' },
  };

  const audiences = {
    general: { icon: <Language />, label: 'General', desc: 'For a broad audience' },
    expert: { icon: <Psychology />, label: 'Expert', desc: 'For domain experts' },
    student: { icon: <School />, label: 'Student', desc: 'For academic learning' },
    professional: { icon: <BusinessCenter />, label: 'Professional', desc: 'For business context' },
  };

  const formats = {
    default: { icon: <Article />, label: 'Narrative', desc: 'Flowing text' },
    bulletpoints: { icon: <FormatListBulleted />, label: 'Bullet Points', desc: 'Key points format' },
    structured: { icon: <Architecture />, label: 'Structured', desc: 'Sectioned format' },
    annotated: { icon: <InfoOutlined />, label: 'Annotated', desc: 'With explanations' },
  };

  const focusOptions = [
    { value: 'methodology', label: 'Methodology', icon: <Science /> },
    { value: 'findings', label: 'Findings', icon: <TrendingUp /> },
    { value: 'implications', label: 'Implications', icon: <Psychology /> },
    { value: 'context', label: 'Context', icon: <Language /> },
    { value: 'applications', label: 'Applications', icon: <BusinessCenter /> },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/summarize`, {
        text,
        style,
        target_audience: targetAudience,
        output_format: outputFormat,
        focus_areas: focusAreas,
      });
      setResult(response.data);
    } catch (err) {
      setError('Failed to generate summary. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSave = async () => {
    if (!result || !user) return;
    try {
      await axios.post(`${API_BASE_URL}/api/articles`, {
        user_id: user.id,
        original_text: text,
        summary: result.summary,
      });
      
      // Show success message
      setSuccessMessage('Article saved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to save article. Please try again.');
      console.error('Save error:', err);
    }
};

  return (
    <Box sx={{ bgcolor: '#f5f7fa', minHeight: 'calc(100vh - 64px)', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" sx={{ mb: 1, color: '#1976d2', fontWeight: 'bold' }}>
           TruthRise
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary" sx={{ mb: 4 }}>
          Transform articles into customized, intelligent summaries
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Customization Options
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Summary Style</InputLabel>
                <Select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  label="Summary Style"
                >
                  {Object.entries(styles).map(([key, { icon, label, desc }]) => (
                    <MenuItem value={key} key={key}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {icon}
                        <Box sx={{ ml: 1 }}>
                          <Typography variant="body1">{label}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {desc}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Target Audience</InputLabel>
                <Select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  label="Target Audience"
                >
                  {Object.entries(audiences).map(([key, { icon, label, desc }]) => (
                    <MenuItem value={key} key={key}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {icon}
                        <Box sx={{ ml: 1 }}>
                          <Typography variant="body1">{label}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {desc}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Output Format</InputLabel>
                <Select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  label="Output Format"
                >
                  {Object.entries(formats).map(([key, { icon, label, desc }]) => (
                    <MenuItem value={key} key={key}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {icon}
                        <Box sx={{ ml: 1 }}>
                          <Typography variant="body1">{label}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {desc}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="subtitle2" gutterBottom>
                Focus Areas
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                {focusOptions.map((option) => (
                  <Chip
                    key={option.value}
                    icon={option.icon}
                    label={option.label}
                    onClick={() => {
                      if (focusAreas.includes(option.value)) {
                        setFocusAreas(focusAreas.filter(area => area !== option.value));
                      } else {
                        setFocusAreas([...focusAreas, option.value]);
                      }
                    }}
                    color={focusAreas.includes(option.value) ? "primary" : "default"}
                    variant={focusAreas.includes(option.value) ? "filled" : "outlined"}
                  />
                ))}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  variant="outlined"
                  placeholder="Paste your article here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={loading || !text.trim()}
                  sx={{
                    height: 48,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                      Processing...
                    </>
                  ) : 'Generate Summary'}
                </Button>
              </form>

              {/* {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )} */}

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              {successMessage && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {successMessage}
                </Alert>
              )}

              {result && (
                <Box sx={{ mt: 4 }}>
                  <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
                    <Tab label="Summary" />
                  </Tabs>
                  
                  {activeTab === 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Paper elevation={1} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                        <Typography variant="body1">
                          {result.summary}
                        </Typography>
                        {user && (
                          <Button
                            startIcon={<SaveAlt />}
                            variant="outlined"
                            onClick={handleSave}
                            sx={{ mt: 2 }}
                          >
                            Save Summary
                          </Button>
                        )}
                      </Paper>
                    </Box>
                  )}

                  {activeTab === 1 && result.metadata?.analysis_results && (
                    <Box sx={{ mt: 2 }}>
                      <Paper elevation={1} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                        <Typography variant="h6" gutterBottom>
                          Analysis Results
                        </Typography>
                        <Typography variant="body1">
                          {JSON.stringify(result.metadata.analysis_results, null, 2)}
                        </Typography>
                      </Paper>
                    </Box>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;