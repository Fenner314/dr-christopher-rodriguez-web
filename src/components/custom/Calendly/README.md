# Calendly Component

A React component that integrates the Calendly widget for appointment scheduling using the `react-calendly` package.

## Usage

The component can be used in two ways:

### 1. As a Custom Page Component

When used as a custom page component, it will use the default settings:

- URL: `https://calendly.com/drcrodriguez`
- Min Width: `720px`
- Height: `500px`

### 2. Direct Import

```tsx
import Calendly from '../components/custom/Calendly'

// Basic usage with defaults
<Calendly />

// Custom configuration
<Calendly
  calendlyUrl="https://calendly.com/drcrodriguez"
  minWidth="400px"
  height="800px"
/>
```

## Props

- `calendlyUrl` (optional): The Calendly URL to embed. Defaults to `https://calendly.com/drcrodriguez`
- `minWidth` (optional): Minimum width of the widget. Defaults to `720px`
- `height` (optional): Height of the widget. Defaults to `700px`

## Features

- Uses the official `react-calendly` package for reliable integration
- Automatically handles script loading and widget initialization
- Responsive design with mobile optimization
- Clean styling and proper TypeScript support
- No manual script management required

## Dependencies

This component requires the `react-calendly` package, which is already installed in this project.

## Styling

The component includes responsive CSS that:

- Centers the widget on desktop
- Adjusts margins for different screen sizes
- Lets the `react-calendly` package handle widget-specific styling
