import {
  FeatureFlag,
  FeatureFlagFormData,
} from "@/interfaces/featureFlag.interface";
import { Label } from "@/components/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { FormField } from "@/components/ui/form-field";
import { CRUDDialog } from "@/components/ui/crud-dialog";
import { extractErrorMessage } from "@/helpers/apiError";
import { createFeatureFlag, updateFeatureFlag } from "@/services/featureFlags";
import { FEATURE_FLAG_KEYS } from "@/config/featureFlags";

interface FeatureFlagDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onFeatureFlagSaved: () => void;
  featureFlagToEdit?: FeatureFlag | null;
  mode?: "create" | "edit";
}

type FeatureFlagFormValues = {
  key: string;
  val: string;
  description: string;
  is_active: boolean;
};

const FLAG_VALUES = ["true", "false"];

export function FeatureFlagDialog({
  isOpen,
  onOpenChange,
  onFeatureFlagSaved,
  featureFlagToEdit = null,
  mode = "create",
}: FeatureFlagDialogProps) {
  return (
    <CRUDDialog<FeatureFlagFormValues>
      open={isOpen}
      onOpenChange={onOpenChange}
      mode={mode}
      resetKey={featureFlagToEdit?.id ?? null}
      initialValues={{ key: "", val: "", description: "", is_active: true }}
      editValues={
        featureFlagToEdit
          ? {
              key: FEATURE_FLAG_KEYS.includes(featureFlagToEdit.key)
                ? featureFlagToEdit.key
                : "",
              val: FLAG_VALUES.includes(featureFlagToEdit.val)
                ? featureFlagToEdit.val
                : "",
              description: featureFlagToEdit.description || "",
              is_active: featureFlagToEdit.is_active === 1,
            }
          : null
      }
      title={{ create: "Create New Feature Flag", edit: "Edit Feature Flag" }}
      submitLabel={{ create: "Create Feature Flag", edit: "Update Feature Flag" }}
      loadingLabel={{ create: "Creating...", edit: "Updating..." }}
      successMessage={{
        create: "Feature flag created successfully.",
        edit: "Feature flag updated successfully.",
      }}
      errorMessage={(err, m) =>
        extractErrorMessage(err, `Failed to ${m} feature flag`)
      }
      errorDisplay="both"
      validate={(values) => {
        if (!values.key.trim()) return { key: "Feature flag key is required" };
        if (!values.val.trim()) return { val: "Feature flag value is required" };
        return null;
      }}
      onSubmit={async (values, { mode: m }) => {
        const flagData: FeatureFlagFormData = {
          key: values.key.trim(),
          val: values.val.trim(),
          description: values.description.trim(),
          is_active: values.is_active ? 1 : 0,
        };
        if (m === "create") {
          await createFeatureFlag(flagData);
        } else {
          if (!featureFlagToEdit?.id) {
            throw new Error("Feature flag ID is missing for update");
          }
          flagData.id = featureFlagToEdit.id;
          await updateFeatureFlag(featureFlagToEdit.id, flagData);
        }
      }}
      onSuccess={() => onFeatureFlagSaved()}
    >
      {({ values, setField, errors }) => (
        <>
          <FormField id="key" label="Key" error={errors.key}>
            <Select
              value={values.key}
              onValueChange={(v) => setField("key", v)}
            >
              <SelectTrigger id="key" autoFocus>
                <SelectValue placeholder="Select a key" />
              </SelectTrigger>
              <SelectContent>
                {FEATURE_FLAG_KEYS.map((key) => (
                  <SelectItem key={key} value={key}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField id="val" label="Value" error={errors.val}>
            <Select
              value={values.val}
              onValueChange={(v) => setField("val", v)}
            >
              <SelectTrigger id="val">
                <SelectValue placeholder="Select a value" />
              </SelectTrigger>
              <SelectContent>
                {FLAG_VALUES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField id="description" label="Description">
            <Textarea
              id="description"
              size="description"
              value={values.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Description of what this feature flag controls"
            />
          </FormField>

          <div className="flex items-center justify-between">
            <Label htmlFor="is_active" className="cursor-pointer">
              Active
            </Label>
            <Switch
              id="is_active"
              checked={values.is_active}
              onCheckedChange={(checked) => setField("is_active", checked)}
            />
          </div>
        </>
      )}
    </CRUDDialog>
  );
}
