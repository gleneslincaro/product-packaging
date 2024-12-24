import React from "react";
import { Grid, Card, Box, Typography } from "@mui/material";
import { Box as PackingBox } from "../types/box";

interface BoxProps {
  availableBoxes: PackingBox[];
  calculateVolume: (length: number, width: number, height: number) => number;
}

const AvailableBoxes: React.FC<BoxProps> = ({
  availableBoxes,
  calculateVolume,
}) => {
  return (
    <Box sx={{ marginBottom: 3 }}>
      <Typography variant="h6" color="textSecondary">
        Available Boxes
      </Typography>
      <Grid container spacing={2}>
        {availableBoxes.map((box, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <Box sx={{ padding: 2 }}>
                <Typography variant="body1">{box.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Dimensions: {box.width} x {box.length} x {box.height} cm
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Volume: {calculateVolume(box.length, box.width, box.height).toLocaleString()}{" "}
                  m³
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Weight Limit: {box.weight_limit} kg
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AvailableBoxes;
