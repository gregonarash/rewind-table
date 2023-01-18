import { Combobox } from "@headlessui/react";
import cn from "clsx";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { HiCheck, HiChevronUpDown } from "react-icons/hi2";

type Option = {
  name: string;
  type?: string;
};

type Props = {
  options: Option[];
  selected?: Option | null;
  label: string;
};

const ComboBox = ({ options, selected = null, label }: Props) => {
  const [selectedPerson, setSelectedPerson] = useState(selected);
  const [query, setQuery] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const filteredOptions =
    query === ""
      ? options
      : options.filter((person) => {
          return person.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox
      as="div"
      value={selectedPerson}
      onChange={setSelectedPerson}
      className="mb-5 @xl:flex"
    >
      <Combobox.Label className="block self-center text-sm font-medium text-gray-700 @xl:mr-3 @xl:grow-0 @xl:basis-28">
        {label}
      </Combobox.Label>
      <div className="relative mt-1 grow self-start">
        <Combobox.Input
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(person: Option) => person?.name}
        />
        <Combobox.Button
          className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
          onClick={() => setQuery("")}
        >
          <HiChevronUpDown
            className="h-5 w-5 text-gray-400"
            aria-label="updown button"
          />
        </Combobox.Button>

        {filteredOptions.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredOptions.map((person) => (
              <Combobox.Option
                key={person.type + person.name}
                value={person}
                className={({ active }) =>
                  cn(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-blue-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <div className="flex">
                      <span
                        className={cn("truncate", selected && "font-semibold")}
                      >
                        {person.name}
                      </span>
                      <span
                        className={cn(
                          "ml-2 truncate text-gray-500",
                          active ? "text-blue-200" : "text-gray-500"
                        )}
                      >
                        {person.type}
                      </span>
                    </div>

                    {selected && (
                      <span
                        className={cn(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-blue-600"
                        )}
                      >
                        <HiCheck className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
};

export default ComboBox;
