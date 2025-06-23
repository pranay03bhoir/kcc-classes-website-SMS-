import CustomHeading from "@/components/Heading/CustomHeading";
import EnquiryAndAddressSection from "@/components/Home/EnquiryAndAddressSection";

const StudentEnroll = () => {
  return (
    <div>
      <div className={`flex justify-center`}>
        <CustomHeading
          title={"Enroll with KCC Classes"}
          padding={`py-14`}
          borderColour={`border-white`}
        />
      </div>
      <div className={`md:pt-44`}>
        <EnquiryAndAddressSection />
      </div>
    </div>
  );
};

export default StudentEnroll;
