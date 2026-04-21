export interface Product {
  id: string
  image: string
  title: string
  category: string
  price: number
  status: 'active' | 'draft' | 'archived'
  createdAt: string
}

export interface Banner {
  id: string
  image: string
  title: string
  type: 'news' | 'article' | 'art' | 'sports' | 'fashion'
  status: 'active' | 'inactive'
  createdAt: string
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  status: 'upcoming' | 'ongoing' | 'completed'
  createdAt: string
}

export interface Offer {
  id: string
  title: string
  description: string
  discount: number
  validUntil: string
  status: 'active' | 'expired'
  createdAt: string
}

export interface Content {
  id: string
  thumbnail: string
  title: string
  category: string
  contentType: 'article' | 'youtube' | 'spotify'
  createdAt: string
}

export interface Contact {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
  status: 'new' | 'read' | 'replied'
}

export interface Subscriber {
  id: string
  email: string
  subscriptionType: 'free' | 'basic' | 'exclusive' | 'premium'
  joinedDate: string
  status: 'active' | 'inactive'
}

export interface Subscription {
  id: string
  name: string
  price: number
  duration: string
  accessLevel: string
  status: 'active' | 'inactive'
  createdAt: string
}

export const dummyProducts: Product[] = [
  {
    id: '1',
    image: '/orlando-jersey.jpg',
    title: 'Orlando Magic Jersey #22',
    category: 'Sports Apparel',
    price: 89.99,
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    image: '/athletic-basketball-shoes.png',
    title: 'Premium Basketball Shoes',
    category: 'Footwear',
    price: 149.99,
    status: 'active',
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    image: '/graphic-tshirt.png',
    title: 'Graphic T-Shirt Collection',
    category: 'Clothing',
    price: 34.99,
    status: 'draft',
    createdAt: '2024-01-13',
  },
  {
    id: '4',
    image: '/orlando-jersey.jpg',
    title: 'Orlando Magic Jersey #22',
    category: 'Sports Apparel',
    price: 89.99,
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '5',
    image: '/orlando-jersey.jpg',
    title: 'Orlando Magic Jersey #22',
    category: 'Sports Apparel',
    price: 89.99,
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '6',
    image: '/orlando-jersey.jpg',
    title: 'Orlando Magic Jersey #22',
    category: 'Sports Apparel',
    price: 89.99,
    status: 'active',
    createdAt: '2024-01-15',
  },
]

export const dummyBanners: Banner[] = [
  {
    id: '1',
    image: '/creative-art-banner.jpg',
    title: 'Creative Art',
    type: 'art',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    image: '/sports-news-banner.jpg',
    title: 'Latest Sports News',
    type: 'sports',
    status: 'active',
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    image: '/sports-news-banner.jpg',
    title: 'Latest Sports News',
    type: 'sports',
    status: 'active',
    createdAt: '2024-01-14',
  },
  {
    id: '4',
    image: '/sports-news-banner.jpg',
    title: 'Latest Sports News',
    type: 'sports',
    status: 'active',
    createdAt: '2024-01-14',
  },
  {
    id: '5',
    image: '/sports-news-banner.jpg',
    title: 'Latest Sports News',
    type: 'sports',
    status: 'active',
    createdAt: '2024-01-14',
  },
  {
    id: '6',
    image: '/sports-news-banner.jpg',
    title: 'Latest Sports News',
    type: 'sports',
    status: 'active',
    createdAt: '2024-01-14',
  },
]

export const dummyEvents: Event[] = [
  {
    id: '1',
    title: 'Exclusive Concert Night',
    description: 'Premium members get access to exclusive concert tickets',
    date: '2024-02-20',
    location: 'Madison Square Garden',
    status: 'upcoming',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Sports Match Premium Access',
    description: 'VIP seating for premium subscribers',
    date: '2024-03-05',
    location: 'Sports Arena',
    status: 'upcoming',
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    title: 'Exclusive Concert Night',
    description: 'Premium members get access to exclusive concert tickets',
    date: '2024-02-20',
    location: 'Madison Square Garden',
    status: 'upcoming',
    createdAt: '2024-01-15',
  },
  {
    id: '4',
    title: 'Exclusive Concert Night',
    description: 'Premium members get access to exclusive concert tickets',
    date: '2024-02-20',
    location: 'Madison Square Garden',
    status: 'upcoming',
    createdAt: '2024-01-15',
  },

  {
    id: '5',
    title: 'Exclusive Concert Night',
    description: 'Premium members get access to exclusive concert tickets',
    date: '2024-02-20',
    location: 'Madison Square Garden',
    status: 'upcoming',
    createdAt: '2024-01-15',
  },
]

export const dummyOffers: Offer[] = [
  {
    id: '1',
    title: 'Premium Subscription 50% Off',
    description: 'Get premium access at half price for the first 3 months',
    discount: 50,
    validUntil: '2024-02-28',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '1',
    title: 'Premium Subscription 50% Off',
    description: 'Get premium access at half price for the first 3 months',
    discount: 50,
    validUntil: '2024-02-28',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Premium Subscription 50% Off',
    description: 'Get premium access at half price for the first 3 months',
    discount: 50,
    validUntil: '2024-02-28',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    title: 'Premium Subscription 50% Off',
    description: 'Get premium access at half price for the first 3 months',
    discount: 50,
    validUntil: '2024-02-28',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '4',
    title: 'Premium Subscription 50% Off',
    description: 'Get premium access at half price for the first 3 months',
    discount: 50,
    validUntil: '2024-02-28',
    status: 'active',
    createdAt: '2024-01-15',
  },
]

export const dummyContent: Content[] = [
  {
    id: '1',
    thumbnail: '/article-thumbnail.png',
    title: '10 Ways to Improve Your Creative Process',
    category: 'Art',
    contentType: 'article',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    thumbnail: '/youtube-thumbnail.png',
    title: 'Behind the Scenes: Studio Session',
    category: 'Music',
    contentType: 'youtube',
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    thumbnail: '/spotify-playlist-vibe.png',
    title: 'Chill Vibes Playlist 2024',
    category: 'Music',
    contentType: 'spotify',
    createdAt: '2024-01-13',
  },
  {
    id: '4',
    thumbnail: '/youtube-thumbnail.png',
    title: 'Behind the Scenes: Studio Session',
    category: 'Music',
    contentType: 'youtube',
    createdAt: '2024-01-14',
  },
  {
    id: '5',
    thumbnail: '/youtube-thumbnail.png',
    title: 'Behind the Scenes: Studio Session',
    category: 'Music',
    contentType: 'youtube',
    createdAt: '2024-01-14',
  },
  {
    id: '6',
    thumbnail: '/youtube-thumbnail.png',
    title: 'Behind the Scenes: Studio Session',
    category: 'Music',
    contentType: 'youtube',
    createdAt: '2024-01-14',
  },
  {
    id: '7',
    thumbnail: '/youtube-thumbnail.png',
    title: 'Behind the Scenes: Studio Session',
    category: 'Music',
    contentType: 'youtube',
    createdAt: '2024-01-14',
  },
  {
    id: '8',
    thumbnail: '/youtube-thumbnail.png',
    title: 'Behind the Scenes: Studio Session',
    category: 'Music',
    contentType: 'youtube',
    createdAt: '2024-01-14',
  },
]

export const dummyContacts: Contact[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Question about Premium Subscription',
    message:
      'I would like to know more about the benefits of premium subscription...',
    createdAt: '2024-01-15',
    status: 'new',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    subject: 'Event Inquiry',
    message: 'Are there any upcoming events for premium members?',
    createdAt: '2024-01-14',
    status: 'read',
  },
  {
    id: '3',
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Question about Premium Subscription',
    message:
      'I would like to know more about the benefits of premium subscription...',
    createdAt: '2024-01-15',
    status: 'new',
  },
  {
    id: '4',
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Question about Premium Subscription',
    message:
      'I would like to know more about the benefits of premium subscription...',
    createdAt: '2024-01-15',
    status: 'new',
  },
  {
    id: '5',
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Question about Premium Subscription',
    message:
      'I would like to know more about the benefits of premium subscription...',
    createdAt: '2024-01-15',
    status: 'new',
  },
  {
    id: '6',
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Question about Premium Subscription',
    message:
      'I would like to know more about the benefits of premium subscription...',
    createdAt: '2024-01-15',
    status: 'new',
  },
  {
    id: '7',
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Question about Premium Subscription',
    message:
      'I would like to know more about the benefits of premium subscription...',
    createdAt: '2024-01-15',
    status: 'new',
  },
]

export const dummySubscribers: Subscriber[] = [
  {
    id: '1',
    email: 'subscriber1@example.com',
    subscriptionType: 'premium',
    joinedDate: '2024-01-01',
    status: 'active',
  },
  {
    id: '2',
    email: 'subscriber2@example.com',
    subscriptionType: 'exclusive',
    joinedDate: '2024-01-05',
    status: 'active',
  },
  {
    id: '3',
    email: 'subscriber3@example.com',
    subscriptionType: 'basic',
    joinedDate: '2024-01-10',
    status: 'active',
  },
  {
    id: '4',
    email: 'subscriber3@example.com',
    subscriptionType: 'basic',
    joinedDate: '2024-01-10',
    status: 'active',
  },
  {
    id: '5',
    email: 'subscriber3@example.com',
    subscriptionType: 'basic',
    joinedDate: '2024-01-10',
    status: 'active',
  },
  {
    id: '6',
    email: 'subscriber3@example.com',
    subscriptionType: 'basic',
    joinedDate: '2024-01-10',
    status: 'active',
  },
  {
    id: '7',
    email: 'subscriber3@example.com',
    subscriptionType: 'basic',
    joinedDate: '2024-01-10',
    status: 'active',
  },
]

export const dummySubscriptions: Subscription[] = [
  {
    id: '1',
    name: 'Free Plan',
    price: 0,
    duration: 'Forever',
    accessLevel: 'Basic Content',
    status: 'active',
    createdAt: '2023-01-01',
  },
  {
    id: '2',
    name: 'Basic Plan',
    price: 9.99,
    duration: 'Monthly',
    accessLevel: 'Standard Content + Newsletter',
    status: 'active',
    createdAt: '2023-01-01',
  },
  {
    id: '3',
    name: 'Exclusive Plan',
    price: 19.99,
    duration: 'Monthly',
    accessLevel: 'Premium Content + Events',
    status: 'active',
    createdAt: '2023-01-01',
  },
  {
    id: '4',
    name: 'Premium Plan',
    price: 29.99,
    duration: 'Monthly',
    accessLevel: 'All Access + VIP Events',
    status: 'active',
    createdAt: '2023-01-01',
  },
]
