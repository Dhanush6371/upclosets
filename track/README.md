# Customer Order Tracking

A modern React-based frontend application for customers to track their orders using order IDs.

## Features

- **Order Tracking**: Enter order ID to track order status
- **Real-time Status**: View current order progress and department
- **Progress Visualization**: Visual progress bar and timeline
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, professional interface with Tailwind CSS

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set environment variables:
Create a `.env` file with:
```
VITE_API_URL=http://localhost:5000/api
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## API Endpoints

The application connects to the backend API at `/api/track/:orderId` to fetch order information.

## Order Status Stages

- **Pending**: Order received
- **In Design**: Design phase
- **In Production**: Production phase
- **In Finishing**: Finishing phase
- **In Dispatch**: Ready for dispatch
- **Dispatched**: Order completed and dispatched


