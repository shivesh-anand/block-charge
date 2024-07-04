'use client';
import BatteryButton from '@/components/BatteryButton';
import Map from '@/components/Map';
import withAuth from '@/components/withAuth';

function MapsPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <div className="z-0 items-center justify-center">
        <Map />
      </div>
      {/* <div className="absolute inset-x-0 bottom-10 flex justify-center items-center z-10">
        <SearchBar />
      </div> */}

      <div className="absolute bottom-10 right-40 flex justify-center items-center z-10">
        <BatteryButton level={100} />
      </div>
    </section>
  );
}

export default withAuth(MapsPage);
