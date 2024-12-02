// import { useState } from "react";
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
//   Grid,
// } from "@mui/material";
// import {
//   SmartToy as RobotOutlined,
//   Person as PersonOutline,
//   Psychology,
//   Shield,
//   Assessment,
// } from "@mui/icons-material";
// import axios from "axios";

// interface DetectionResult {
//   is_ai_generated: boolean;
//   confidence: number;
//   metrics: {
//     pattern_analysis: {
//       avg_sentence_length: number;
//       lexical_diversity: number;
//       sentence_start_variety: number;
//       repetition_score: number;
//     };
//     style_indicators: {
//       repetitive_patterns: boolean;
//       uniform_sentence_length: boolean;
//       limited_sentence_variety: boolean;
//       unnatural_lexical_diversity: boolean;
//     };
//   };
//   analysis: string;
// }

// const AIDetection = () => {
//   const [text, setText] = useState("");
//   const [result, setResult] = useState<DetectionResult | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/detect-ai`,
//         {
//           text,
//         }
//       );
//       setResult(response.data);
//     } catch (err) {
//       setError("Failed to analyze text. Please try again.");
//       console.error("Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatMetricLabel = (label: string): string => {
//     return label
//       .split("_")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");
//   };

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         minHeight: "calc(100vh - 64px)",
//         background: "linear-gradient(145deg, #f6f9fc 0%, #edf1f7 100%)",
//         py: 6,
//       }}
//     >
//       <Container maxWidth="lg">
//         {/* Header Section */}
//         <Box sx={{ textAlign: "center", mb: 6 }}>
//           <Typography
//             variant="h3"
//             component="h1"
//             gutterBottom
//             sx={{
//               fontWeight: 700,
//               background: "linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               mb: 2,
//             }}
//           >
//             AI Content Detector
//           </Typography>
//           <Typography
//             variant="h6"
//             color="text.secondary"
//             sx={{ maxWidth: "600px", mx: "auto", mb: 4 }}
//           >
//             Advanced analysis to detect AI-generated content with high precision
//           </Typography>

//           {/* Feature cards */}
//           <Grid container spacing={3} sx={{ mb: 6 }}>
//             {[
//               {
//                 icon: <Psychology sx={{ fontSize: 30 }} />,
//                 title: "Pattern Analysis",
//                 description: "Deep linguistic pattern recognition",
//               },
//               {
//                 icon: <Assessment sx={{ fontSize: 30 }} />,
//                 title: "Style Detection",
//                 description: "Writing style and consistency checks",
//               },
//               {
//                 icon: <Shield sx={{ fontSize: 30 }} />,
//                 title: "High Accuracy",
//                 description: "Advanced detection algorithms",
//               },
//             ].map((feature, index) => (
//               <Grid item xs={12} md={4} key={index}>
//                 <Paper
//                   elevation={2}
//                   sx={{
//                     p: 3,
//                     height: "100%",
//                     transition: "transform 0.2s",
//                     "&:hover": { transform: "translateY(-4px)" },
//                   }}
//                 >
//                   <Box sx={{ color: "primary.main", mb: 2 }}>
//                     {feature.icon}
//                   </Box>
//                   <Typography variant="h6" gutterBottom>
//                     {feature.title}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {feature.description}
//                   </Typography>
//                 </Paper>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>

//         {/* Main Analysis Section */}
//         <Paper
//           elevation={3}
//           sx={{
//             p: 4,
//             borderRadius: 2,
//             bgcolor: "rgba(255, 255, 255, 0.95)",
//             backdropFilter: "blur(10px)",
//           }}
//         >
//           <form onSubmit={handleSubmit}>
//             <TextField
//               fullWidth
//               multiline
//               rows={8}
//               variant="outlined"
//               placeholder="Paste your text here..."
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               sx={{
//                 mb: 3,
//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: 2,
//                   backgroundColor: "white",
//                 },
//               }}
//             />
//             <Button
//               variant="contained"
//               type="submit"
//               disabled={loading || !text.trim()}
//               fullWidth
//               size="large"
//               sx={{
//                 mb: 2,
//                 height: 56,
//                 borderRadius: 2,
//                 background: "linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)",
//                 boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
//                 transition: "all 0.3s",
//                 "&:hover": {
//                   background:
//                     "linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)",
//                   transform: "translateY(-2px)",
//                   boxShadow: "0 6px 10px 2px rgba(33, 203, 243, .3)",
//                 },
//               }}
//             >
//               {loading ? (
//                 <Box sx={{ display: "flex", alignItems: "center" }}>
//                   <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
//                   Analyzing...
//                 </Box>
//               ) : (
//                 "Analyze Text"
//               )}
//             </Button>
//           </form>

//           {error && (
//             <Alert
//               severity="error"
//               sx={{
//                 mt: 2,
//                 borderRadius: 2,
//               }}
//             >
//               {error}
//             </Alert>
//           )}

//           {/* Results Section */}
//           {result && (
//             <Box sx={{ mt: 4 }}>
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   mb: 2,
//                   p: 3,
//                   bgcolor: result.is_ai_generated ? "error.50" : "success.50",
//                   borderRadius: 2,
//                 }}
//               >

//                 <Chip
//                   icon={
//                     result.is_ai_generated ? (
//                       <RobotOutlined />
//                     ) : (
//                       <PersonOutline />
//                     )
//                   }
//                   label={
//                     result.is_ai_generated ? "AI-Generated" : "Human-Written"
//                   }
//                   color={result.is_ai_generated ? "error" : "success"}
//                   variant="filled"
//                   sx={{
//                     mr: 2,
//                     px: 2,
//                     backgroundColor: result.is_ai_generated
//                       ? "#d32f2f"
//                       : "#2e7d32",
//                     "& .MuiChip-label": {
//                       fontSize: "1rem",
//                       px: 1,
//                     },
//                   }}
//                 />
//                 <Typography variant="h6" color="text.secondary">
//                   Confidence: {(result.confidence * 100).toFixed(1)}%
//                 </Typography>
//               </Box>

//               <Grid container spacing={3}>
//                 {/* Pattern Analysis */}
//                 <Grid item xs={12} md={6}>
//                   <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
//                     <Typography
//                       variant="h6"
//                       gutterBottom
//                       sx={{ color: "primary.main" }}
//                     >
//                       Pattern Analysis
//                     </Typography>
//                     {Object.entries(result.metrics.pattern_analysis).map(
//                       ([key, value]) => (
//                         <Box key={key} sx={{ mb: 2 }}>
//                           <Typography variant="body2" gutterBottom>
//                             {formatMetricLabel(key)}
//                           </Typography>
//                           <Box
//                             sx={{
//                               display: "flex",
//                               alignItems: "center",
//                               gap: 1,
//                             }}
//                           >
//                             <LinearProgress
//                               variant="determinate"
//                               value={value * 100}
//                               sx={{
//                                 height: 8,
//                                 borderRadius: 4,
//                                 flexGrow: 1,
//                                 bgcolor: "grey.100",
//                               }}
//                             />
//                             <Typography
//                               variant="body2"
//                               sx={{ minWidth: "45px" }}
//                             >
//                               {(value * 100).toFixed(0)}%
//                             </Typography>
//                           </Box>
//                         </Box>
//                       )
//                     )}
//                   </Paper>
//                 </Grid>

//                 {/* Style Indicators */}
//                 <Grid item xs={12} md={6}>
//                   <Paper
//                     elevation={2}
//                     sx={{ p: 3, borderRadius: 2, height: "100%" }}
//                   >
//                     <Typography
//                       variant="h6"
//                       gutterBottom
//                       sx={{ color: "primary.main" }}
//                     >
//                       Style Indicators
//                     </Typography>
//                     <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
//                       {Object.entries(result.metrics.style_indicators).map(
//                         ([key, value]) => (
//                           <Chip
//                             key={key}
//                             label={formatMetricLabel(key)}
//                             color={value ? "error" : "success"}
//                             variant="outlined"
//                             sx={{
//                               borderRadius: 2,
//                               px: 1,
//                             }}
//                           />
//                         )
//                       )}
//                     </Box>
//                   </Paper>
//                 </Grid>
//               </Grid>

//               {result.analysis && (
//                 <Paper
//                   elevation={1}
//                   sx={{ mt: 3, p: 3, borderRadius: 2, bgcolor: "#f8f9fa" }}
//                 >
//                   <Typography
//                     variant="h6"
//                     gutterBottom
//                     sx={{ color: "primary.main" }}
//                   >
//                     Detailed Analysis
//                   </Typography>
//                   <Typography variant="body2">{result.analysis}</Typography>
//                 </Paper>
//               )}
//             </Box>
//           )}
//         </Paper>
//       </Container>
//     </Box>
//   );
// };

// export default AIDetection;

import { useState } from "react";
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
} from "@mui/material";
import {
  SmartToy as RobotOutlined,
  Person as PersonOutline,
  Psychology,
  Shield,
  Assessment,
} from "@mui/icons-material";
import axios from "axios";

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
  const [text, setText] = useState("");
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/detect-ai`,
        { text }
      );
      setResult(response.data);
    } catch (err) {
      setError("Failed to analyze text. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatMetricLabel = (label: string): string => {
    return label
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 64px)",
        background: "linear-gradient(145deg, #f6f9fc 0%, #edf1f7 100%)",
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
            }}
          >
            AI Content Detector
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: "600px", mx: "auto", mb: 4 }}
          >
            Advanced analysis to detect AI-generated content with high precision
          </Typography>

          <Grid container spacing={3} sx={{ mb: 6 }}>
            {[
              {
                icon: <Psychology sx={{ fontSize: 30 }} />,
                title: "Pattern Analysis",
                description: "Deep linguistic pattern recognition",
              },
              {
                icon: <Assessment sx={{ fontSize: 30 }} />,
                title: "Style Detection",
                description: "Writing style and consistency checks",
              },
              {
                icon: <Shield sx={{ fontSize: 30 }} />,
                title: "High Accuracy",
                description: "Advanced detection algorithms",
              },
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    height: "100%",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "translateY(-4px)" },
                  }}
                >
                  <Box sx={{ color: "primary.main", mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            bgcolor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              multiline
              rows={8}
              variant="outlined"
              placeholder="Paste your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "white",
                },
              }}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading || !text.trim()}
              fullWidth
              size="large"
              sx={{
                mb: 2,
                height: 56,
                borderRadius: 2,
                background: "linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)",
                boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                transition: "all 0.3s",
                "&:hover": {
                  background: "linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 10px 2px rgba(33, 203, 243, .3)",
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  Analyzing...
                </Box>
              ) : (
                "Analyze Text"
              )}
            </Button>
          </form>

          {error && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {result && (
            <Box sx={{ mt: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  p: 3,
                  bgcolor: !result.is_ai_generated ? "success.50" : "error.50",
                  borderRadius: 2,
                }}
              >
                <Chip
                  icon={result.is_ai_generated ? <RobotOutlined /> : <PersonOutline />}
                  label={result.is_ai_generated ? "AI-Generated" : "Human-Written"}
                  color={result.is_ai_generated ? "error" : "success"}
                  variant="filled"
                  sx={{
                    mr: 2,
                    px: 2,
                    "& .MuiChip-label": {
                      fontSize: "1rem",
                      px: 1,
                    },
                  }}
                />
                <Typography variant="h6" color="text.secondary">
                  Confidence: {(result.confidence * 100).toFixed(1)}%
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: "primary.main" }}>
                      Pattern Analysis
                    </Typography>
                    {Object.entries(result.metrics.pattern_analysis).map(
                      ([key, value]) => (
                        <Box key={key} sx={{ mb: 2 }}>
                          <Typography variant="body2" gutterBottom>
                            {formatMetricLabel(key)}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={value * 100}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                flexGrow: 1,
                                bgcolor: "grey.100",
                              }}
                            />
                            <Typography variant="body2" sx={{ minWidth: "45px" }}>
                              {(value * 100).toFixed(0)}%
                            </Typography>
                          </Box>
                        </Box>
                      )
                    )}
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
                    <Typography variant="h6" gutterBottom sx={{ color: "primary.main" }}>
                      Style Indicators
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {Object.entries(result.metrics.style_indicators).map(
                        ([key, value]) => (
                          <Chip
                            key={key}
                            label={formatMetricLabel(key)}
                            color={value ? "error" : "success"}
                            variant="outlined"
                            sx={{ borderRadius: 2, px: 1 }}
                          />
                        )
                      )}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              {result.analysis && (
                <Paper elevation={1} sx={{ mt: 3, p: 3, borderRadius: 2, bgcolor: "#f8f9fa" }}>
                  <Typography variant="h6" gutterBottom sx={{ color: "primary.main" }}>
                    Detailed Analysis
                  </Typography>
                  <Typography variant="body2">{result.analysis}</Typography>
                </Paper>
              )}
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default AIDetection;