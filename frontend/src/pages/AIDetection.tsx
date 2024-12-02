// import { useState } from 'react';
// import {
//   Container,
//   Paper,
//   TextField,
//   Button,
//   Typography,
//   Box,
//   CircularProgress,
//   Alert,
//   LinearProgress,
//   Chip,
// } from '@mui/material';
// import { SmartToy as RobotOutlined, Person as PersonOutline } from '@mui/icons-material';
// import axios from 'axios';

// interface DetectionResult {
//   is_ai_generated: boolean;
//   confidence: number;
// }

// const AIDetection = () => {
//   const [text, setText] = useState('');
//   const [result, setResult] = useState<DetectionResult | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);
    
//     try {
//       const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/detect-ai`, {
//         text
//       });
//       setResult(response.data);
//     } catch (err) {
//       setError('Failed to analyze text. Please try again.');
//       console.error('Error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container maxWidth="md">
//       <Box sx={{ mt: 4, mb: 6 }}>
//         <Typography variant="h4" component="h1" gutterBottom align="center">
//           AI Content Detector
//         </Typography>
//         <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 4 }}>
//           Paste your text to check if it was written by AI
//         </Typography>

//         <Paper elevation={3} sx={{ p: 4 }}>
//           <form onSubmit={handleSubmit}>
//             <TextField
//               fullWidth
//               multiline
//               rows={8}
//               variant="outlined"
//               placeholder="Paste your text here..."
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               sx={{ mb: 3 }}
//             />
//             <Button 
//               variant="contained" 
//               type="submit"
//               disabled={loading || !text.trim()}
//               fullWidth
//               size="large"
//               sx={{ mb: 2 }}
//             >
//               {loading ? (
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                   <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
//                   Analyzing...
//                 </Box>
//               ) : 'Analyze Text'}
//             </Button>
//           </form>

//           {error && (
//             <Alert severity="error" sx={{ mt: 2 }}>
//               {error}
//             </Alert>
//           )}

//           {result && (
//             <Box sx={{ mt: 4 }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                 <Chip
//                   icon={result.is_ai_generated ? <RobotOutlined /> : <PersonOutline />}
//                   label={result.is_ai_generated ? 'AI-Generated' : 'Human-Written'}
//                   color={result.is_ai_generated ? 'error' : 'success'}
//                   variant="outlined"
//                   sx={{ mr: 2 }}
//                 />
//                 <Typography variant="body2" color="text.secondary">
//                   Confidence: {(result.confidence * 100).toFixed(1)}%
//                 </Typography>
//               </Box>
//               <LinearProgress
//                 variant="determinate"
//                 value={result.confidence * 100}
//                 color={result.is_ai_generated ? 'error' : 'success'}
//                 sx={{ height: 8, borderRadius: 4 }}
//               />
//               <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
//                 {result.is_ai_generated 
//                   ? 'This text shows strong indicators of being AI-generated.'
//                   : 'This text appears to be written by a human.'}
//               </Typography>
//             </Box>
//           )}
//         </Paper>
//       </Box>
//     </Container>
//   );
// };

// export default AIDetection;


import { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  LinearProgress,
  Chip,
  Grid,
} from '@mui/material';
import { SmartToy as RobotOutlined, Person as PersonOutline } from '@mui/icons-material';
import axios from 'axios';

interface DetectionResult {
  is_ai_generated: boolean;
  confidence: number;
  metrics: {
    pattern_analysis: {
      avg_sentence_length: number;
      lexical_diversity: number;
      sentence_start_variety: number;
      repetition_score: number;
    };
    style_indicators: {
      repetitive_patterns: boolean;
      uniform_sentence_length: boolean;
      limited_sentence_variety: boolean;
      unnatural_lexical_diversity: boolean;
    };
  };
  analysis: string;
}

const AIDetection = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/detect-ai`, {
        text
      });
      setResult(response.data);
    } catch (err) {
      setError('Failed to analyze text. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatMetricLabel = (label: string): string => {
    return label
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          AI Content Detector
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Paste your text to check if it was written by AI
        </Typography>

        <Paper elevation={3} sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              multiline
              rows={8}
              variant="outlined"
              placeholder="Paste your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button 
              variant="contained" 
              type="submit"
              disabled={loading || !text.trim()}
              fullWidth
              size="large"
              sx={{ mb: 2 }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  Analyzing...
                </Box>
              ) : 'Analyze Text'}
            </Button>
          </form>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {result && (
            <Box sx={{ mt: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Chip
                  icon={result.is_ai_generated ? <RobotOutlined /> : <PersonOutline />}
                  label={result.is_ai_generated ? 'AI-Generated' : 'Human-Written'}
                  color={result.is_ai_generated ? 'error' : 'success'}
                  variant="outlined"
                  sx={{ mr: 2 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Confidence: {(result.confidence * 100).toFixed(1)}%
                </Typography>
              </Box>
              
              <LinearProgress
                variant="determinate"
                value={result.confidence * 100}
                color={result.is_ai_generated ? 'error' : 'success'}
                sx={{ height: 8, borderRadius: 4, mb: 3 }}
              />

              <Grid container spacing={3}>
                {/* Pattern Analysis */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Pattern Analysis
                    </Typography>
                    {Object.entries(result.metrics.pattern_analysis).map(([key, value]) => (
                      <Box key={key} sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {formatMetricLabel(key)}:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={value * 100}
                            sx={{ 
                              height: 6, 
                              borderRadius: 3,
                              flexGrow: 1
                            }}
                          />
                          <Typography variant="body2" color="text.secondary" sx={{ minWidth: '45px' }}>
                            {(value * 100).toFixed(0)}%
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Paper>
                </Grid>

                {/* Style Indicators */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Style Indicators
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {Object.entries(result.metrics.style_indicators).map(([key, value]) => (
                        <Chip
                          key={key}
                          label={formatMetricLabel(key)}
                          color={value ? 'error' : 'success'}
                          variant="outlined"
                          size="small"
                        />
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                {result.is_ai_generated 
                  ? 'This text shows strong indicators of being AI-generated.'
                  : 'This text appears to be written by a human.'}
              </Typography>

              {result.analysis && (
                <Paper elevation={1} sx={{ mt: 3, p: 2, bgcolor: '#f8f9fa' }}>
                  <Typography variant="body2">
                    {result.analysis}
                  </Typography>
                </Paper>
              )}
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default AIDetection;