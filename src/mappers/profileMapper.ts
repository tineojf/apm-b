type CreateProfileInput = {
  id: string;
  body: {
    fullName: string;
  };
};

export function mapToProfileEntity({ id, body }: CreateProfileInput) {
  return {
    id: id,
    full_name: body.fullName,
    is_premium: false,
  };
}
