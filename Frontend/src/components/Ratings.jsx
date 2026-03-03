import { Box, Rating, Typography } from "@mui/material";

export const showAverageRating = (product) => {
  const ratings = product?.ratings;

  // If no ratings
  if (!ratings || ratings.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          my: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No ratings yet
        </Typography>
      </Box>
    );
  }

  const totalRatings = ratings.length;

  // Make sure star is treated as number
  const totalStars = ratings.reduce(
    (sum, item) => sum + Number(item.star),
    0
  );

  const average = totalStars / totalRatings;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        my: 1,
      }}
    >
      <Rating
        value={average}
        precision={0.5}
        readOnly
        size="small"
      />

      <Typography variant="body2" fontWeight={600}>
        {average.toFixed(1)}
      </Typography>

      <Typography variant="body2" color="text.secondary">
        ({totalRatings})
      </Typography>
    </Box>
  );
};