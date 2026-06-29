import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { UserModel, ItemModel, BookingModel, ReviewModel } from '../models/Schemas';
import { User, Item, Booking, Review } from '../types';

const JSON_DB_DIR = path.join(__dirname, '../data');
const JSON_DB_FILE = path.join(JSON_DB_DIR, 'db.json');

interface SchemaDB {
  users: User[];
  items: Item[];
  bookings: Booking[];
  reviews: Review[];
}

class DBService {
  private useMongo = false;
  private memoryDb: SchemaDB = {
    users: [],
    items: [],
    bookings: [],
    reviews: []
  };

  constructor() {
    this.ensureJsonDbExists();
    this.loadJsonDb();
  }

  private ensureJsonDbExists() {
    if (!fs.existsSync(JSON_DB_DIR)) {
      fs.mkdirSync(JSON_DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(JSON_DB_FILE)) {
      fs.writeFileSync(JSON_DB_FILE, JSON.stringify(this.memoryDb, null, 2), 'utf-8');
    }
  }

  private loadJsonDb() {
    try {
      this.ensureJsonDbExists();
      const content = fs.readFileSync(JSON_DB_FILE, 'utf-8');
      this.memoryDb = JSON.parse(content);
    } catch (error) {
      console.error('Error loading JSON DB fallback:', error);
    }
  }

  private saveJsonDb() {
    try {
      this.ensureJsonDbExists();
      fs.writeFileSync(JSON_DB_FILE, JSON.stringify(this.memoryDb, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error saving JSON DB fallback:', error);
    }
  }

  public async connect(): Promise<boolean> {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.log('------------------------------------------------------');
      console.log('⚠️  MONGODB_URI is not defined. Running in JSON DB fallback mode.');
      console.log(`📂  Database file: ${JSON_DB_FILE}`);
      console.log('------------------------------------------------------');
      this.useMongo = false;
      return false;
    }

    try {
      mongoose.set('strictQuery', false);
      await mongoose.connect(mongoUri);
      console.log('------------------------------------------------------');
      console.log('🚀 Successfully connected to MongoDB!');
      console.log('------------------------------------------------------');
      this.useMongo = true;
      return true;
    } catch (error) {
      console.error('------------------------------------------------------');
      console.error('❌ Failed to connect to MongoDB. Falling back to JSON DB mode.', error);
      console.error('------------------------------------------------------');
      this.useMongo = false;
      return false;
    }
  }

  public isUsingMongo(): boolean {
    return this.useMongo;
  }

  // --- USER OPERATIONS ---
  public async findUsers(filter?: Partial<User>): Promise<User[]> {
    if (this.useMongo) {
      const users = await UserModel.find(filter || {});
      return users.map(u => u.toObject() as User);
    } else {
      this.loadJsonDb();
      return this.memoryDb.users.filter(u => {
        if (!filter) return true;
        return Object.entries(filter).every(([key, value]) => (u as any)[key] === value);
      });
    }
  }

  public async findUserById(id: string): Promise<User | null> {
    if (this.useMongo) {
      const user = await UserModel.findById(id);
      return user ? (user.toObject() as User) : null;
    } else {
      this.loadJsonDb();
      return this.memoryDb.users.find(u => u._id === id) || null;
    }
  }

  public async createUser(user: Omit<User, '_id'> & { _id: string }): Promise<User> {
    const newUser: User = {
      ...user,
      createdAt: user.createdAt || new Date().toISOString()
    };
    if (this.useMongo) {
      const doc = new UserModel(newUser);
      await doc.save();
      return doc.toObject() as User;
    } else {
      this.loadJsonDb();
      // Remove duplicates
      this.memoryDb.users = this.memoryDb.users.filter(u => u._id !== user._id);
      this.memoryDb.users.push(newUser);
      this.saveJsonDb();
      return newUser;
    }
  }

  public async updateUser(id: string, update: Partial<User>): Promise<User | null> {
    if (this.useMongo) {
      const doc = await UserModel.findByIdAndUpdate(id, { $set: update }, { new: true });
      return doc ? (doc.toObject() as User) : null;
    } else {
      this.loadJsonDb();
      const index = this.memoryDb.users.findIndex(u => u._id === id);
      if (index === -1) return null;
      const updatedUser = { ...this.memoryDb.users[index], ...update };
      this.memoryDb.users[index] = updatedUser;
      this.saveJsonDb();
      return updatedUser;
    }
  }

  public async deleteUser(id: string): Promise<boolean> {
    if (this.useMongo) {
      const res = await UserModel.findByIdAndDelete(id);
      return !!res;
    } else {
      this.loadJsonDb();
      const lenBefore = this.memoryDb.users.length;
      this.memoryDb.users = this.memoryDb.users.filter(u => u._id !== id);
      this.saveJsonDb();
      return this.memoryDb.users.length < lenBefore;
    }
  }

  // --- ITEM OPERATIONS ---
  public async findItems(filters?: any): Promise<Item[]> {
    if (this.useMongo) {
      const query: any = {};
      if (filters?.category) query.category = filters.category;
      if (filters?.location) query.location = new RegExp(filters.location, 'i');
      if (filters?.search) {
        query.$or = [
          { name: new RegExp(filters.search, 'i') },
          { description: new RegExp(filters.search, 'i') },
          { location: new RegExp(filters.search, 'i') }
        ];
      }
      if (filters?.minPrice || filters?.maxPrice) {
        query.price = {};
        if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
        if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
      }
      if (filters?.rating) query.rating = { $gte: Number(filters.rating) };

      let queryExec = ItemModel.find(query);

      // Sorting
      if (filters?.sort) {
        if (filters.sort === 'price_asc') queryExec = queryExec.sort({ price: 1 });
        else if (filters.sort === 'price_desc') queryExec = queryExec.sort({ price: -1 });
        else if (filters.sort === 'rating') queryExec = queryExec.sort({ rating: -1 });
        else if (filters.sort === 'newest') queryExec = queryExec.sort({ createdAt: -1 });
        else if (filters.sort === 'duration') queryExec = queryExec.sort({ duration: 1 });
      }

      const items = await queryExec;
      return items.map(i => i.toObject() as Item);
    } else {
      this.loadJsonDb();
      let result = [...this.memoryDb.items];

      if (filters?.category) {
        result = result.filter(item => item.category.toLowerCase() === filters.category.toLowerCase());
      }
      if (filters?.location) {
        result = result.filter(item => item.location.toLowerCase().includes(filters.location.toLowerCase()));
      }
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter(item => 
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.location.toLowerCase().includes(searchLower)
        );
      }
      if (filters?.minPrice) {
        result = result.filter(item => item.price >= Number(filters.minPrice));
      }
      if (filters?.maxPrice) {
        result = result.filter(item => item.price <= Number(filters.maxPrice));
      }
      if (filters?.rating) {
        result = result.filter(item => item.rating >= Number(filters.rating));
      }

      // Sorting
      if (filters?.sort) {
        if (filters.sort === 'price_asc') {
          result.sort((a, b) => a.price - b.price);
        } else if (filters.sort === 'price_desc') {
          result.sort((a, b) => b.price - a.price);
        } else if (filters.sort === 'rating') {
          result.sort((a, b) => b.rating - a.rating);
        } else if (filters.sort === 'newest') {
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (filters.sort === 'duration') {
          result.sort((a, b) => a.duration - b.duration);
        }
      }

      return result;
    }
  }

  public async findItemById(id: string): Promise<Item | null> {
    if (this.useMongo) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const item = await ItemModel.findById(id);
      return item ? (item.toObject() as Item) : null;
    } else {
      this.loadJsonDb();
      return this.memoryDb.items.find(i => i._id === id) || null;
    }
  }

  public async createItem(item: Omit<Item, '_id' | 'createdAt'> & { createdAt?: string }): Promise<Item> {
    const newId = this.useMongo ? new mongoose.Types.ObjectId().toString() : `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newItem: Item = {
      _id: newId,
      ...item,
      createdAt: new Date().toISOString()
    };
    if (this.useMongo) {
      const doc = new ItemModel(newItem);
      await doc.save();
      return doc.toObject() as Item;
    } else {
      this.loadJsonDb();
      this.memoryDb.items.push(newItem);
      this.saveJsonDb();
      return newItem;
    }
  }

  public async updateItem(id: string, update: Partial<Item>): Promise<Item | null> {
    if (this.useMongo) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const doc = await ItemModel.findByIdAndUpdate(id, { $set: update }, { new: true });
      return doc ? (doc.toObject() as Item) : null;
    } else {
      this.loadJsonDb();
      const index = this.memoryDb.items.findIndex(i => i._id === id);
      if (index === -1) return null;
      const updatedItem = { ...this.memoryDb.items[index], ...update };
      this.memoryDb.items[index] = updatedItem;
      this.saveJsonDb();
      return updatedItem;
    }
  }

  public async deleteItem(id: string): Promise<boolean> {
    if (this.useMongo) {
      if (!mongoose.Types.ObjectId.isValid(id)) return false;
      const res = await ItemModel.findByIdAndDelete(id);
      return !!res;
    } else {
      this.loadJsonDb();
      const lenBefore = this.memoryDb.items.length;
      this.memoryDb.items = this.memoryDb.items.filter(i => i._id !== id);
      this.saveJsonDb();
      return this.memoryDb.items.length < lenBefore;
    }
  }

  // --- BOOKING OPERATIONS ---
  public async findBookings(filters?: any): Promise<Booking[]> {
    if (this.useMongo) {
      const query: any = {};
      if (filters?.userId) query.userId = filters.userId;
      if (filters?.itemId) query.itemId = filters.itemId;
      if (filters?.status) query.status = filters.status;
      const docs = await BookingModel.find(query).sort({ createdAt: -1 });
      return docs.map(d => d.toObject() as Booking);
    } else {
      this.loadJsonDb();
      let result = [...this.memoryDb.bookings];
      if (filters?.userId) result = result.filter(b => b.userId === filters.userId);
      if (filters?.itemId) result = result.filter(b => b.itemId === filters.itemId);
      if (filters?.status) result = result.filter(b => b.status === filters.status);
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return result;
    }
  }

  public async findBookingById(id: string): Promise<Booking | null> {
    if (this.useMongo) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const doc = await BookingModel.findById(id);
      return doc ? (doc.toObject() as Booking) : null;
    } else {
      this.loadJsonDb();
      return this.memoryDb.bookings.find(b => b._id === id) || null;
    }
  }

  public async createBooking(booking: Omit<Booking, '_id' | 'createdAt'> & { createdAt?: string }): Promise<Booking> {
    const newId = this.useMongo ? new mongoose.Types.ObjectId().toString() : `booking_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newBooking: Booking = {
      _id: newId,
      ...booking,
      createdAt: new Date().toISOString()
    };
    if (this.useMongo) {
      const doc = new BookingModel(newBooking);
      await doc.save();
      return doc.toObject() as Booking;
    } else {
      this.loadJsonDb();
      this.memoryDb.bookings.push(newBooking);
      this.saveJsonDb();
      return newBooking;
    }
  }

  public async updateBooking(id: string, update: Partial<Booking>): Promise<Booking | null> {
    if (this.useMongo) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const doc = await BookingModel.findByIdAndUpdate(id, { $set: update }, { new: true });
      return doc ? (doc.toObject() as Booking) : null;
    } else {
      this.loadJsonDb();
      const index = this.memoryDb.bookings.findIndex(b => b._id === id);
      if (index === -1) return null;
      const updatedBooking = { ...this.memoryDb.bookings[index], ...update };
      this.memoryDb.bookings[index] = updatedBooking;
      this.saveJsonDb();
      return updatedBooking;
    }
  }

  public async deleteBooking(id: string): Promise<boolean> {
    if (this.useMongo) {
      if (!mongoose.Types.ObjectId.isValid(id)) return false;
      const res = await BookingModel.findByIdAndDelete(id);
      return !!res;
    } else {
      this.loadJsonDb();
      const lenBefore = this.memoryDb.bookings.length;
      this.memoryDb.bookings = this.memoryDb.bookings.filter(b => b._id !== id);
      this.saveJsonDb();
      return this.memoryDb.bookings.length < lenBefore;
    }
  }

  // --- REVIEW OPERATIONS ---
  public async findReviews(filters?: any): Promise<Review[]> {
    if (this.useMongo) {
      const query: any = {};
      if (filters?.itemId) query.itemId = filters.itemId;
      if (filters?.userId) query.userId = filters.userId;
      const docs = await ReviewModel.find(query).sort({ createdAt: -1 });
      return docs.map(d => d.toObject() as Review);
    } else {
      this.loadJsonDb();
      let result = [...this.memoryDb.reviews];
      if (filters?.itemId) result = result.filter(r => r.itemId === filters.itemId);
      if (filters?.userId) result = result.filter(r => r.userId === filters.userId);
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return result;
    }
  }

  public async createReview(review: Omit<Review, '_id' | 'createdAt'> & { createdAt?: string }): Promise<Review> {
    const newId = this.useMongo ? new mongoose.Types.ObjectId().toString() : `review_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newReview: Review = {
      _id: newId,
      ...review,
      createdAt: new Date().toISOString()
    };
    if (this.useMongo) {
      const doc = new ReviewModel(newReview);
      await doc.save();
      
      // Update item rating & reviewsCount
      const reviews = await ReviewModel.find({ itemId: review.itemId });
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      await ItemModel.findByIdAndUpdate(review.itemId, {
        rating: Number((totalRating / reviews.length).toFixed(1)),
        reviewsCount: reviews.length
      });

      return doc.toObject() as Review;
    } else {
      this.loadJsonDb();
      this.memoryDb.reviews.push(newReview);
      
      // Update item rating & reviewsCount
      const reviews = this.memoryDb.reviews.filter(r => r.itemId === review.itemId);
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const itemIndex = this.memoryDb.items.findIndex(i => i._id === review.itemId);
      if (itemIndex !== -1) {
        this.memoryDb.items[itemIndex].rating = Number((totalRating / reviews.length).toFixed(1));
        this.memoryDb.items[itemIndex].reviewsCount = reviews.length;
      }

      this.saveJsonDb();
      return newReview;
    }
  }

  public async deleteReview(id: string): Promise<boolean> {
    if (this.useMongo) {
      if (!mongoose.Types.ObjectId.isValid(id)) return false;
      const doc = await ReviewModel.findById(id);
      if (!doc) return false;
      const itemId = doc.itemId;
      await ReviewModel.findByIdAndDelete(id);
      
      // Update item rating
      const reviews = await ReviewModel.find({ itemId });
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      await ItemModel.findByIdAndUpdate(itemId, {
        rating: reviews.length ? Number((totalRating / reviews.length).toFixed(1)) : 5,
        reviewsCount: reviews.length
      });
      return true;
    } else {
      this.loadJsonDb();
      const doc = this.memoryDb.reviews.find(r => r._id === id);
      if (!doc) return false;
      const itemId = doc.itemId;
      this.memoryDb.reviews = this.memoryDb.reviews.filter(r => r._id !== id);
      
      // Update item rating
      const reviews = this.memoryDb.reviews.filter(r => r.itemId === itemId);
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const itemIndex = this.memoryDb.items.findIndex(i => i._id === itemId);
      if (itemIndex !== -1) {
        this.memoryDb.items[itemIndex].rating = reviews.length ? Number((totalRating / reviews.length).toFixed(1)) : 5;
        this.memoryDb.items[itemIndex].reviewsCount = reviews.length;
      }
      this.saveJsonDb();
      return true;
    }
  }

  // --- SEED OR BULK RESET FOR LOCAL DEVELOPMENT ---
  public seedDatabase(data: SchemaDB) {
    this.memoryDb = data;
    this.saveJsonDb();
  }
}

export const dbService = new DBService();
export default dbService;
