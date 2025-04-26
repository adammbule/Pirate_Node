import CoinKeyRental from '../models/coinKeyRental.js';
import CoinKey from '../models/coinKey.js';

// Create a new rental (Tier III) - valid for 1 year
export const rentCoinKey = async (req, res) => {
  try {
    const { coinKeyId } = req.body;
    const renterId = req.user.userId;

    // Find the CoinKey being rented
    const coinKey = await CoinKey.findById(coinKeyId);
    if (!coinKey) return res.status(404).json({ message: 'CoinKey not found' });

    // Check if the rental limit (10) is exceeded
    const activeRentals = await CoinKeyRental.countDocuments({ coinKey: coinKeyId });
    if (activeRentals >= 10) {
      return res.status(403).json({ message: 'Rental limit reached for this CoinKey' });
    }

    // Set rental duration to 1 year from now
    const now = new Date();
    const oneYearLater = new Date(now);
    oneYearLater.setFullYear(now.getFullYear() + 1);

    // Create and save the rental
    const rental = new CoinKeyRental({
      renter: renterId,
      coinKey: coinKeyId,
      rentalStart: now,
      rentalEnd: oneYearLater
    });

    await rental.save();

    res.status(201).json({
      message: 'CoinKey rented successfully',
      rentalId: rental._id,
      rentalEnd: rental.rentalEnd
    });
  } catch (err) {
    console.error('Rental error:', err);
    res.status(500).json({ message: 'Error processing rental' });
  }
};

// Get all active rentals for a user
export const getUserRentals = async (req, res) => {
  try {
    const userId = req.user.userId;
    const rentals = await CoinKeyRental.find({ renter: userId }).populate('coinKey');
    res.json(rentals);
  } catch (err) {
    console.error('Fetch rental error:', err);
    res.status(500).json({ message: 'Could not fetch rentals' });
  }
};
