import HigherSecondary from "@/components/CoursesExploration/HigherSecondary";
import CustomHeading from "@/components/Heading/CustomHeading";

const HigherSecondaryProgram = () => {
  return (
    <div>
      <div className={`flex justify-center pt-10`}>
        <CustomHeading
          title={`Higher Secondary programs`}
          padding={`py-14`}
          borderColour={`border-white`}
        />
      </div>
      <div>
        <HigherSecondary />
      </div>
    </div>
  );
};

export default HigherSecondaryProgram;
