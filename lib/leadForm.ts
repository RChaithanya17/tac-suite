export type LeadFormData = {
  name: string;
  email: string;
  phone: string;
  age: string;
  qualification: string;
};

export const initialLeadFormData: LeadFormData = {
  name: "",
  email: "",
  phone: "",
  age: "",
  qualification: "",
};

export async function submitLeadForm(data: LeadFormData, pageUrl: string) {
  const res = await fetch(
    "https://n8n.srv993899.hstgr.cloud/webhook/website-lead-form",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        age: data.age,
        qualification: data.qualification,
        source: "TAC_Website",
        page_url: pageUrl,
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to submit");
  }
}
