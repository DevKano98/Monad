from app.schemas.fix import FixVote


def test_fix_vote_schema_accepts_successful_vote() -> None:
    vote = FixVote(successful=True, proof_hash="abc123")
    assert vote.successful is True
    assert vote.proof_hash == "abc123"
