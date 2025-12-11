import { useModal } from "@/contexts/ModalContext";
import { Button } from "@/components/modules/button";

function Index() {
  const { showModal } = useModal();


  return (
    <Button
      onClick={() => {
        showModal({
          title: "بردیا فتاحی",
          data: {name : "amirhosein"},
          size: "xl",

          content: ({ id, data, close, update, openNested }) => (
            <form
              className="flex items-center flex-wrap"
            >
              
              <p>{data.name}</p>
              <Button type="submit">Submit</Button>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  openNested({
                    title: "مودال شماره ۲",
                    data: { name: "امیرحسین" },
                    content: ({ data, close, update, parentId }) => (
                      <div>
                        <p>سلام {data.name}</p>
                        <Button
                          onClick={() => {
                            update(parentId, {name : "امیرحسین غلامی"});
                            close({name : "امیرحسین غلامی"})
                          }}
                        >
                          آپدیت مودال اول
                        </Button>
                      </div>
                    ),
                    onClose: (res) => {
                      console.log("نتیجه مودال دوم:", res);
                    },
                  });
                }}
              >
                باز کردن مودال دوم
              </Button>
            </form>
          ),

          onClose: (result) => {
            console.log(result);
          },
        });
      }}
    >
      Open Modal
    </Button>
  );
}

export default Index;
