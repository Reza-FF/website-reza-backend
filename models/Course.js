// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Judul course harus diisi'],
    trim: true,
    maxlength: [100, 'Judul maksimal 100 karakter']
  },
  description: {
    type: String,
    required: [true, 'Deskripsi course harus diisi'],
    maxlength: [1000, 'Deskripsi maksimal 1000 karakter']
  },
  shortDescription: {
    type: String,
    required: [true, 'Deskripsi singkat harus diisi'],
    maxlength: [200, 'Deskripsi singkat maksimal 200 karakter']
  },
  image: {
    type: String,
    required: [true, 'Gambar course harus diisi']
  },
  price: {
    type: Number,
    required: [true, 'Harga course harus diisi'],
    min: [0, 'Harga tidak boleh negatif']
  },
  originalPrice: {
    type: Number,
    default: 0
  },
  duration: {
    type: String,
    required: [true, 'Durasi course harus diisi']
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: [true, 'Level course harus diisi']
  },
  category: {
    type: String,
    required: [true, 'Kategori course harus diisi'],
    enum: ['Web Development', 'Mobile Development', 'Data Science', 'UI/UX Design', 'DevOps', 'Other']
  },
  instructor: {
    name: {
      type: String,
      required: [true, 'Nama instructor harus diisi']
    },
    bio: {
      type: String,
      required: [true, 'Bio instructor harus diisi']
    },
    image: {
      type: String,
      required: [true, 'Foto instructor harus diisi']
    },
    experience: {
      type: String,
      required: [true, 'Pengalaman instructor harus diisi']
    }
  },
  curriculum: [{
    title: {
      type: String,
      required: [true, 'Judul materi harus diisi']
    },
    duration: {
      type: String,
      required: [true, 'Durasi materi harus diisi']
    },
    description: {
      type: String,
      required: [true, 'Deskripsi materi harus diisi']
    }
  }],
  whatYouWillLearn: [{
    type: String,
    required: [true, 'Learning outcome harus diisi']
  }],
  requirements: [{
    type: String,
    required: [true, 'Requirement harus diisi']
  }],
  tags: [{
    type: String,
    trim: true
  }],
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  totalStudents: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt sebelum save
courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual untuk discount percentage
courseSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice > 0 && this.price < this.originalPrice) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Ensure virtual fields are serialized
courseSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);