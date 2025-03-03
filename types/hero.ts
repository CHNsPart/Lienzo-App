export interface SlideContent {
  imageSrc: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface SlideProps {
  slide: SlideContent;
  isActive: boolean;
  alignment: 'start' | 'end';
}