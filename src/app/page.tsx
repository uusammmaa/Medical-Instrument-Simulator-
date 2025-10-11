import { MainLayout } from '@/components/layout/MainLayout';
import { MenuBar } from '@/components/toolbar/MenuBar';
import { ChartArea } from '@/components/chart/ChartArea';

export default function Home() {
  return (
    <MainLayout>
      <MenuBar />
      <ChartArea />
    </MainLayout>
  );
}